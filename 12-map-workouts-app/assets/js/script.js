'use strict';

(function () {
  // Elements
  const form = document.querySelector('.form');
  const containerWorkouts = document.querySelector('.workouts');
  const inputType = document.querySelector('.form__input--type');
  const inputDistance = document.querySelector('.form__input--distance');
  const inputDuration = document.querySelector('.form__input--duration');
  const inputCadence = document.querySelector('.form__input--cadence');
  const inputElevation = document.querySelector('.form__input--elevation');
  const inputSort = document.querySelector('.buttons__input--sort');
  const btnClear = document.querySelector('.buttons__btn--clear');

  // Leaflet draw controls
  let drawPolylineBtn, drawActionsList;

  // Application architecture
  class Workout {
    date = new Date();
    id = (Date.now() + '').slice(-10);
    location;
    temperature;

    constructor(coords, distance, duration) {
      this.coords = coords; // [ {lat, lng}, {lat, lng} ]
      this.distance = distance; // km
      this.duration = duration; // min
    }

    setDescription() {
      // prettier-ignore
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

      this.description = `${
        this.type[0].toUpperCase() + this.type.slice(1)
      } on ${months[this.date.getMonth()]} ${this.date.getDate()}`;
    }

    async setWorkoutLocationAndWeather() {
      try {
        // BigDataCloud API
        const GEOCODE_URL =
          'https://api.bigdatacloud.net/data/reverse-geocode-client';

        // Open Meteo API
        const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';

        const { lat, lng } = this.coords[0];
        const geocodeURL = `${GEOCODE_URL}?&latitude=${lat}&longitude=${lng}`;
        const weatherURL = `${WEATHER_URL}?latitude=${lat}&longitude=${lng}&current=temperature_2m`;

        const [geocodeRes, weatherRes] = await Promise.all([
          fetch(geocodeURL),
          fetch(weatherURL),
        ]);

        if (geocodeRes.ok) {
          const data = await geocodeRes.json();
          this.location = data.city;
        }

        if (weatherRes.ok) {
          const weatherData = await weatherRes.json();

          const temperatureValue = weatherData.current.temperature_2m;
          const temperatureUnit = weatherData.current_units.temperature_2m;
          this.temperature = temperatureValue.toFixed() + temperatureUnit;
        }
      } catch (err) {
        throw err;
      }
    }
  }

  class Running extends Workout {
    type = 'running';

    constructor(coords, { distance, duration, cadence }) {
      super(coords, distance, duration);
      this.cadence = cadence;
      this.calcPace();
      this.setDescription();
    }

    calcPace() {
      // min/km
      this.pace = this.duration / this.distance;
      return this.pace;
    }
  }

  class Cycling extends Workout {
    type = 'cycling';

    constructor(coords, { distance, duration, elevationGain }) {
      super(coords, distance, duration);
      this.elevationGain = elevationGain;
      this.calcSpeed();
      this.setDescription();
    }

    calcSpeed() {
      // km/h
      this.speed = this.distance / (this.duration / 60);
      return this.speed;
    }
  }

  class App {
    #map;
    #mapZoomLevel = 15;
    #newWorkoutCoords;
    #activePath;
    #workoutAction;
    #workouts = [];
    #workoutsLayers = [];

    constructor() {
      // Get user's position
      this.#getPosition();
      // Get data from local storage
      this.#getLocalStorage();
      // Attach event listeners
      form.addEventListener('submit', this.#handleFormSubmit.bind(this));
      inputType.addEventListener('change', this.#toggleElevationField);
      containerWorkouts.addEventListener(
        'click',
        this.#handleWorkoutAction.bind(this)
      );
      inputSort.addEventListener('change', this.sort.bind(this));
      btnClear.addEventListener('click', this.reset);
    }

    #getPosition() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          this.#loadMap.bind(this),
          () => {
            alert('Could not get your position!');
          }
        );
      }
    }

    #loadMap(position) {
      // Generate map
      const { latitude, longitude } = position.coords;

      this.#map = L.map('map').setView(
        [latitude, longitude],
        this.#mapZoomLevel
      );

      L.tileLayer('https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(this.#map);

      // Add draw controls
      const drawOpts = {
        position: 'topleft',
        draw: {
          polygon: false,
          circle: false,
          rectangle: false,
          marker: false,
        },
        edit: false,
      };
      const drawControl = new L.Control.Draw(drawOpts);
      this.#map.addControl(drawControl);

      // Save DOM elements of polyline draw controls
      drawPolylineBtn = document.querySelector('.leaflet-draw-draw-polyline');
      drawActionsList = document.querySelector('.leaflet-draw-actions');

      // Create map control button named 'Fit markers'
      const btnOpts = {
        position: 'topright',
        className: 'leaflet-control-fit-markers',
        attrs: {
          href: '#',
          title: 'Fit markers',
          role: 'button',
        },
        eventHandlers: [
          {
            type: 'click',
            fn: this.fitMarkers.bind(this),
          },
        ],
      };
      const btnControl = this.#createCustomMapControlButton(btnOpts);
      this.#map.addControl(btnControl);

      // Attach event listeners to the map
      this.#map.on('click', this.#handleMapClick.bind(this));
      this.#map.on(L.Draw.Event.CREATED, this.#handlePolylineDrawn.bind(this));

      // Render workout entries
      this.#workouts.forEach((workout) => {
        this.#renderWorkoutMarker(workout);
      });
    }

    #handleMapClick(e) {
      this.#checkCancelWorkoutEditing();
      this.#hideShowPath();
      // Activate 'draw polyline' button and start drawing polyline
      // if 'draw polyline' button is not active
      if (
        !drawActionsList.style.display ||
        drawActionsList.style.display === 'none'
      ) {
        drawPolylineBtn.click();
        this.#map.fire('mousemove', e);
        this.#map.fire('click', e);
      }
    }

    #handlePolylineDrawn(e) {
      const { layerType, layer } = e;

      if (layerType === 'polyline') {
        const latlngs = layer.getLatLngs();
        this.#newWorkoutCoords = latlngs;
        this.#showForm('new');
      }
    }

    #createCustomMapControlButton({
      position,
      className,
      attrs,
      eventHandlers,
    }) {
      const btnConstructor = L.Control.extend({
        options: { position },
        onAdd: function (map) {
          // Create DOM elements
          const container = L.DomUtil.create(
            'div',
            'leaflet-bar leaflet-control'
          );
          const button = L.DomUtil.create('a', className, container);

          // Set attributes to the button
          for (const [k, v] of Object.entries(attrs)) {
            button[k] = v;
          }

          L.DomEvent.preventDefault(button);
          L.DomEvent.disableClickPropagation(button);

          // Attach event listeners to the button
          eventHandlers.forEach(({ type, fn }) =>
            L.DomEvent.on(button, type, fn)
          );

          return container;
        },
        onRemove: function (map) {},
      });

      const btnControl = new btnConstructor();
      return btnControl;
    }

    #checkCancelWorkoutEditing() {
      // Check if any workout entry is currently edited
      if (!this.#workoutAction) return;

      // Cancel workout entry editing
      // Reset background color of active workout entry
      const bgColor = getComputedStyle(document.body).getPropertyValue(
        '--color-dark--2'
      );
      this.#workoutAction.workoutEl.style.backgroundColor = bgColor;

      // Clear input fields and hide form
      this.#hideForm();

      // Clear memory from data about active workout entry
      this.#workoutAction = null;
    }

    #showForm(mode) {
      // Disable 'type' field if the form is opened in edit mode
      inputType.disabled = mode === 'edit';
      form.classList.remove('hidden');
      inputDistance.focus();
    }

    #hideForm() {
      // Set default value to 'type' field
      inputType.value = 'running';
      inputType.dispatchEvent(new Event('change'));

      // Clear inputs
      inputDistance.value =
        inputDuration.value =
        inputCadence.value =
        inputElevation.value =
          '';

      // Fix to avoid workouts list jumping
      form.style.display = 'none';
      form.classList.add('hidden');
      setTimeout(() => (form.style.display = 'grid'), 0);
      this.#displayFormErrorMessage(false);
    }

    #toggleElevationField() {
      const type = inputType.value;
      inputCadence
        .closest('.form__row')
        .classList[type === 'running' ? 'remove' : 'add']('form__row--hidden');
      inputElevation
        .closest('.form__row')
        .classList[type === 'running' ? 'add' : 'remove']('form__row--hidden');
    }

    #displayFormErrorMessage(show) {
      form
        .querySelector('.form__message')
        .classList[show ? 'remove' : 'add']('form__message--hidden');
    }

    #handleFormSubmit(e) {
      e.preventDefault();

      // Helper function
      const validInputs = (...inputs) =>
        inputs.every((input) => Number.isFinite(input) && input > 0);

      // Get data from the form
      const type = inputType.value;
      const distance = +inputDistance.value;
      const duration = +inputDuration.value;
      const cadence = +inputCadence.value;
      const elevationGain = +inputElevation.value;

      // Validate input fields
      if (
        !validInputs(
          distance,
          duration,
          type === 'running' ? cadence : elevationGain
        )
      ) {
        return this.#displayFormErrorMessage(true);
      }

      // Put all changable workout data into the object
      const data = {
        type,
        distance,
        duration,
        ...(type === 'running' ? { cadence } : { elevationGain }),
      };

      if (!this.#workoutAction) {
        // 'Workout creation' mode
        this.#newWorkout(data);
      } else {
        // 'Workout editing' mode
        this.#editWorkoutSaving(data);
      }
    }

    async #newWorkout(data) {
      try {
        // If workout is running, create running object
        // If workout is cycling, create cycling object
        const workout = new (data.type === 'running' ? Running : Cycling)(
          this.#newWorkoutCoords,
          data
        );
        this.#newWorkoutCoords = null;

        // Set workout location and weather temperature
        await workout.setWorkoutLocationAndWeather();

        // Add new workout to workouts array
        this.#workouts.push(workout);

        // Render workout path and marker on the map
        this.#renderWorkoutMarker(workout, true);

        // Render workout entry on UI list
        this.#renderWorkout(workout);

        // Hide form and clear input fields
        this.#hideForm();

        // Save workouts array to local storage
        this.#setLocalStorage();
      } catch (err) {
        console.log(err);
      }
    }

    #editWorkoutSaving(data) {
      const { workoutEl, workout } = this.#workoutAction;

      // Overwrite workout entry properties
      for (let [k, v] of Object.entries(data)) {
        workout[k] = v;
      }
      // Recalculate pace/speed
      data.type === 'running' ? workout.calcPace() : workout.calcSpeed();

      // Re-render edited workout entry
      workoutEl.remove();
      this.#renderWorkout(workout);

      // Cancel workout entry editing
      this.#checkCancelWorkoutEditing();

      // Save changes to local storage
      this.#setLocalStorage();
    }

    #renderWorkoutMarker(
      { id, coords, type, description },
      renderPath = false
    ) {
      // Create workout path and marker layers
      const path = L.polyline(coords);
      const marker = L.marker(coords[0]);

      // Show / hide path on marker click
      marker.on('click', this.#handleMarkerClick.bind(this));

      // Save new workout layers
      this.#workoutsLayers.push({ path, marker });

      // Add path layer to the map and hide it if 'renderPath' is false
      path.addTo(this.#map);
      if (renderPath) this.#activePath = path;
      else path.setLatLngs(false);

      // Render workout marker
      marker
        .addTo(this.#map)
        .bindPopup(
          L.popup({
            maxWidth: 250,
            minWidth: 100,
            autoClose: false,
            closeOnClick: false,
            content: `${type === 'running' ? '🏃‍♂️' : '🚴‍♀️'} ${description}`,
            className: `${type}-popup`,
          })
        )
        .openPopup();
    }

    #handleMarkerClick(e) {
      const idx = this.#workoutsLayers.findIndex(
        ({ marker }) => marker === e.target
      );
      const coords = this.#workouts[idx].coords;
      const path = this.#workoutsLayers[idx].path;
      this.#hideShowPath(path, coords);
    }

    #renderWorkout({
      id,
      type,
      description,
      distance,
      duration,
      pace,
      cadence,
      speed,
      elevationGain,
      location,
      temperature,
    }) {
      let html = `
        <li class="workout workout--${type}" data-id="${id}">
          <div class="workout__title">
            <p>${description}</p>
          </div>
          <div class="workout__controls">
            <span class="workout__controls--option" data-action="edit">📝</span>
            <span class="workout__controls--option" data-action="delete">🧺</span>
          </div>
          <div class="workout__details--location">
            <span class="workout__icon">📍</span>
            <span class="workout__value">${location}</span>
          </div>
          <div class="workout__details--temperature">
            <span class="workout__icon">🌡</span>
            <span class="workout__value">${temperature}</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">${
              type === 'running' ? '🏃‍♂️' : '🚴‍♀️'
            }</span>
            <span class="workout__value">${distance}</span>
            <span class="workout__unit">km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⏱</span>
            <span class="workout__value">${duration}</span>
            <span class="workout__unit">min</span>
          </div>
      `;

      if (type === 'running') {
        html += `
          <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${pace.toFixed(1)}</span>
            <span class="workout__unit">min/km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">🦶🏼</span>
            <span class="workout__value">${cadence}</span>
            <span class="workout__unit">spm</span>
          </div>
        `;
      }

      if (type === 'cycling') {
        html += `
          <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${speed.toFixed(1)}</span>
            <span class="workout__unit">km/h</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⛰</span>
            <span class="workout__value">${elevationGain}</span>
            <span class="workout__unit">m</span>
          </div>
        `;
      }

      html += `
          <div class="workout__action--confirmation">
            <p class="workout__message workout__message--hidden" data-action="edit">
              Do you want to edit the workout?
              <span class="confirmation__answer" data-answer="yes">💹</span>
              <span class="confirmation__answer" data-answer="no">❌</span>
            </p>
            <p class="workout__message workout__message--hidden" data-action="delete">
              Do you want to delete the workout?
              <span class="confirmation__answer" data-answer="yes">💹</span>
              <span class="confirmation__answer" data-answer="no">❌</span>
            </p>
          </div>
        </li>
      `;

      form.insertAdjacentHTML('afterend', html);
    }

    #handleWorkoutAction(e) {
      // Check if workout entry was clicked
      const workoutEl = e.target.closest('.workout');
      if (!workoutEl) return;

      // Check if confirmation message or icons were clicked
      const messageElVisible = e.target.closest('.workout__message');
      if (messageElVisible) return;

      const workoutIdx = this.#workouts.findIndex(
        (workout) => workout.id === workoutEl.dataset.id
      );
      const workout = this.#workouts[workoutIdx];
      const workoutLayers = this.#workoutsLayers[workoutIdx];

      // Check if edit or delete workout icons were clicked
      const actionEl = e.target.closest('.workout__controls--option');
      if (!actionEl) {
        // Move to workout marker
        this.#moveToWorkout(workout, workoutLayers);
        return;
      }

      // Check and cancel previous workout entry editing
      this.#checkCancelWorkoutEditing();

      // Display confirmation message and save relevant data to the app state
      const action = actionEl.dataset.action;
      const messageEl = actionEl
        .closest('.workout')
        .querySelector(`.workout__message[data-action="${action}"]`);
      messageEl.classList.remove('workout__message--hidden');

      this.#workoutAction = {
        workoutIdx,
        workout,
        workoutLayers,
        workoutEl,
        action,
        messageEl,
      };

      // Set disposable event listener to handle action confirmation
      document.body.addEventListener(
        'click',
        this.#handleWorkoutActionConfirmation.bind(this),
        { capture: true, once: true }
      );
    }

    #moveToWorkout({ coords }, { path }) {
      this.#hideShowPath(path, coords);

      // Move to the workout marker
      const markerCoords = coords[0];
      this.#map.setView(markerCoords, this.#mapZoomLevel, {
        animage: true,
        pan: {
          duration: 1,
        },
      });
    }

    #hideShowPath(newPath, coords) {
      // New path and active path are the same
      if (newPath && this.#activePath && newPath === this.#activePath) return;

      // If there is active path then hide it
      if (this.#activePath) {
        this.#activePath.setLatLngs(false);
        this.#activePath = null;
      }

      // If new path is passed then show it
      if (newPath) {
        this.#activePath = newPath;
        newPath.setLatLngs(coords);
      }
    }

    #handleWorkoutActionConfirmation(e) {
      const { action, messageEl, workoutLayers } = this.#workoutAction;

      // Hide confirmation message
      messageEl.classList.add('workout__message--hidden');

      // Check if user clicked on 'yes' icon
      const answer = e.target.closest('.confirmation__answer')?.dataset.answer;

      if (answer === 'yes') {
        // User clicked on 'yes' icon - edit or delete active workout entry
        action === 'delete'
          ? this.#removeWorkout(this.#workoutAction)
          : this.#editWorkoutPreparing(this.#workoutAction);
      } else {
        // User didn't click on 'yes' icon - reset active workout entry
        this.#workoutAction = null;
      }
    }

    #editWorkoutPreparing({ workout, workoutEl }) {
      const { type, distance, duration, cadence, elevationGain } = workout;

      // Move active workout entry to top of the list
      document.querySelector('.workout').before(workoutEl);

      // Change background color of active workout entry
      const bgColor = getComputedStyle(document.body).getPropertyValue(
        '--color-dark--3'
      );
      workoutEl.style.backgroundColor = bgColor;

      // Fill form fields with workout data
      inputType.value = type;
      inputType.dispatchEvent(new Event('change'));
      inputDistance.value = distance;
      inputDuration.value = duration;
      if (type === 'running') {
        inputCadence.value = cadence;
      }
      if (type === 'cycling') {
        inputElevation.value = elevationGain;
      }

      // Show form
      this.#showForm('edit');
    }

    #removeWorkout({ workoutIdx, workoutEl }) {
      // Remove workout entry from app state
      this.#workouts.splice(workoutIdx, 1);

      // Remove workout path and marker
      const { path, marker } = this.#workoutsLayers.splice(workoutIdx, 1)[0];
      path.remove();
      marker.remove();

      // Remove workout entry from UI
      workoutEl.remove();

      // Save changes
      this.#setLocalStorage();

      // Clear memory from data about active workout entry
      this.#workoutAction = null;
    }

    #setLocalStorage() {
      localStorage.setItem('workouts', JSON.stringify(this.#workouts));
    }

    #getLocalStorage() {
      const data = JSON.parse(localStorage.getItem('workouts'));

      if (!data) return;

      // Restore prototype chain of instances stored in local storage
      const workouts = [];
      data.forEach((workout) => {
        const revivedObj = new (workout.type === 'running' ? Running : Cycling)(
          [...workout.coords],
          { ...workout }
        );
        Object.assign(revivedObj, workout);
        workouts.push(revivedObj);
      });

      this.#workouts = workouts;
      this.#workouts.forEach((workout) => {
        this.#renderWorkout(workout);
      });
    }

    fitMarkers() {
      // Check if there is any workout entry
      if (!this.#workoutsLayers.length) return;

      const markersCoords = this.#workoutsLayers.map((workout) =>
        workout.marker.getLatLng()
      );
      const bounds = L.latLngBounds(markersCoords).pad(0.1);
      this.#map.fitBounds(bounds);
    }

    sort() {
      // Check if there is any workout entry
      if (!this.#workouts.length) return;

      const prop = inputSort.value;

      const sortedWorkouts =
        prop === 'date'
          ? this.#workouts
          : this.#workouts.slice().sort((a, b) => {
              const [prop1, prop2] = prop.split('/');

              // Sorted by workout type
              if (prop1 === 'type') {
                return a[prop].localeCompare(b[prop]);
              }

              // Check if entries are sorted by pace/speed or cadence/elevationGain
              if (prop2) {
                if (a.type !== b.type) {
                  // Sorted by workout type
                  return a.type.localeCompare(b.type);
                } else {
                  // Sorted by pace/speed or cadence/elevationGain
                  return (
                    a[a[prop1] ? prop1 : prop2] - b[b[prop1] ? prop1 : prop2]
                  );
                }
              }

              // Sorted by distance or duration
              return a[prop] - b[prop];
            });

      // Remove all workout entries, keep only form element
      containerWorkouts.replaceChildren(form);
      sortedWorkouts.forEach((workout) => this.#renderWorkout(workout));
    }

    reset() {
      // Check if there is any workout entry
      if (!localStorage.getItem('workouts')) return;

      localStorage.removeItem('workouts');
      location.reload();
    }
  }

  const app = new App();
})();

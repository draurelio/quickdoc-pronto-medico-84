import React from 'react';

const PrescriptionCreationForm: React.FC = () => {
  return (
    <form>
      <div>
        <label htmlFor="patient">Patient:</label>
        {/* Placeholder for patient selection */}
        <select id="patient" name="patient">
          <option value="">Select Patient</option>
        </select>
      </div>
      <div>
        <label htmlFor="medication">Medication:</label>
        <input type="text" id="medication" name="medication" />
      </div>
      <div>
        <label htmlFor="dosage">Dosage:</label>
        <input type="text" id="dosage" name="dosage" />
      </div>
      <div>
        <label htmlFor="time">Time:</label>
        <input type="text" id="time" name="time" />
      </div>
      <div>
        <label htmlFor="route">Route:</label>
        <input type="text" id="route" name="route" />
      </div>
      <div>
        <label htmlFor="observations">Observations:</label>
        <textarea id="observations" name="observations" />
      </div>
      <button type="submit">Create Prescription</button>
    </form>
  );
};

export default PrescriptionCreationForm;

import React from 'react';

const PatientForm: React.FC = () => {
  return (
    <form>
      <div>
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" name="name" />
      </div>
      <div>
        <label htmlFor="dob">Date of Birth:</label>
        <input type="date" id="dob" name="dob" />
      </div>
      <div>
        <label htmlFor="contact">Contact Information:</label>
        <input type="text" id="contact" name="contact" />
      </div>
      <button type="submit">Save Patient</button>
    </form>
  );
};

export default PatientForm;

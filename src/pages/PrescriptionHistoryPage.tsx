import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient'; // Adjust path as needed
import PrescriptionHistoryItem from '../components/prescription/PrescriptionHistoryItem'; // Adjust path as needed
import { Button } from '@/components/ui/button'; // Assuming a Button component exists

// Define an interface for the prescription data from Supabase
// Define an interface for the prescription data from Supabase
interface SupabasePrescription {
  id: number;
  patient_name: string;
  date: string;
  medication_name: string; // This was 'medication' in MedicalPrescription's formData. Assuming 'medication_name' in DB.
  dosage: string;
  route: string;
  frequency: string;
  duration: string;
  instructions: string; // Changed from 'observations' to match MedicalPrescription form and new DB schema
  patient_dob: string; 
  patient_contact: string;
  // Add any other fields from the 'prescriptions' table that might be needed
}

const PrescriptionHistoryPage: React.FC = () => {
  const [prescriptions, setPrescriptions] = useState<SupabasePrescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        setLoading(true);
        // TODO: Update with actual table name and column names.
        // This query now selects more fields, assuming they exist in your 'prescriptions' table
        // or are available via a join. For example, patient_dob and patient_contact might come
        // from a 'patients' table joined with 'prescriptions'.
        // Example: 'id, date, medication_name, dosage, route, frequency, duration, instructions, patient_dob, patient_contact, patients(name, dob, contact)'
        // For simplicity, assuming patient_name, patient_dob, patient_contact are denormalized or correctly selected.
        const { data, error: supabaseError } = await supabase
          .from('prescriptions') // Replace 'prescriptions' with your actual table name
          .select('id, patient_name, date, medication_name, dosage, route, frequency, duration, instructions, patient_dob, patient_contact');

        if (supabaseError) {
          throw supabaseError;
        }

        setPrescriptions(data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch prescriptions.');
        console.error("Error fetching prescriptions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, []);

  const handleViewDetails = (id: number) => {
    // Placeholder for view details functionality
    // This could navigate to a detailed prescription view page or open a modal
    console.log("View details for prescription ID:", id);
    // Example: navigate(`/prescriptions/${id}`);
  };

  if (loading) {
    return <div>Loading prescription history...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Prescription History</h1>
      {prescriptions.length === 0 ? (
        <p>No prescriptions found.</p>
      ) : (
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Patient Name</th>
              <th className="py-2 px-4 border-b">Date</th>
              <th className="py-2 px-4 border-b">Medication</th>
              <th className="py-2 px-4 border-b">Frequency</th>
              <th className="py-2 px-4 border-b">Duration</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {prescriptions.map((p) => (
              <PrescriptionHistoryItem
                key={p.id}
                prescription={{
                  id: p.id,
                  patientName: p.patient_name, 
                  date: new Date(p.date).toLocaleDateString(),
                  medication: p.medication_name, 
                  frequency: p.frequency, // Pass to PrescriptionHistoryItem for display
                  duration: p.duration,   // Pass to PrescriptionHistoryItem for display
                  fullPrescriptionData: {
                    medication: p.medication_name,
                    dosage: p.dosage || "N/A",
                    route: p.route || "N/A",
                    frequency: p.frequency || "N/A",
                    duration: p.duration || "N/A",
                    observations: p.instructions || "N/A", 
                  },
                  patientData: { 
                    name: p.patient_name,
                    dob: p.patient_dob || "N/A", 
                    contact: p.patient_contact || "N/A",
                  },
                }}
                onViewDetails={handleViewDetails}
              />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PrescriptionHistoryPage;

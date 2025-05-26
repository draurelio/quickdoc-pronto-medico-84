import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient'; // Adjust path as needed
import PrescriptionHistoryItem from '../components/prescription/PrescriptionHistoryItem'; // Adjust path as needed
import { Button } from '@/components/ui/button'; // Assuming a Button component exists

// Define an interface for the prescription data from Supabase
interface SupabasePrescription {
  id: number;
  patient_name: string; 
  date: string; 
  medication_name: string; 
  // Assume these fields are available from your Supabase table or a join
  dosage: string;
  time: string;
  route: string;
  observations: string;
  patient_dob: string; // e.g., from a joined 'patients' table
  patient_contact: string; // e.g., from a joined 'patients' table
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
        // If using a join, the select string would be more complex, e.g., 
        // 'id, date, medication_name, dosage, time, route, observations, patients(name, dob, contact)'
        // And you'd need to ensure 'patient_name' is correctly mapped or use patients.name.
        const { data, error: supabaseError } = await supabase
          .from('prescriptions') // Replace 'prescriptions' with your actual table name
          .select('id, patient_name, date, medication_name, dosage, time, route, observations, patient_dob, patient_contact'); // Adjust columns as needed

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
                  medication: p.medication_name, // Display medication
                  patientData: {
                    name: p.patient_name,
                    dob: p.patient_dob || "N/A", // Provide fallback if data can be null
                    contact: p.patient_contact || "N/A", // Provide fallback
                  },
                  fullPrescriptionData: {
                    medication: p.medication_name, // Or a more detailed medication string if available
                    dosage: p.dosage || "N/A",
                    time: p.time || "N/A",
                    route: p.route || "N/A",
                    observations: p.observations || "N/A",
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

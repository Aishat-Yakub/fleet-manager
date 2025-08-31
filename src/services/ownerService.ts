export async function submitMaintenanceRequest(requestData: {
  vehicleId: number;
  ownerId: number | string;
  issue: string;
  priority: 'low' | 'medium' | 'high';
}) {
  try {
    const response = await fetch('/api/owners', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'maintenance',
        vehicle_id: requestData.vehicleId,
        owner_id: Number(requestData.ownerId),
        issue: requestData.issue,
        priority: requestData.priority,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to submit maintenance request');
    }

    return await response.json();
  } catch (error) {
    console.error('submitMaintenanceRequest error:', error);
    throw error;
  }
}
import pool from '../../db/pool';

export interface VehiclePayload {
  vehicle_name: string;
  type: string;
  registration_number: string;
  daily_rent_price: number;
  availability_status: string;
}

export interface Vehicle extends VehiclePayload {
  id: number;
  created_at: string;
}

// Create vehicle
export const create = async (payload: VehiclePayload): Promise<Vehicle> => {
  const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = payload;

  if (!vehicle_name || !type || !registration_number || !daily_rent_price || !availability_status) {
    throw { status: 400, message: 'Missing required fields' };
  }

  const client = await pool.connect();
  try {
    const check = await client.query(
      'SELECT id FROM vehicles WHERE registration_number = $1',
      [registration_number]
    );
    if ((check.rowCount ?? 0) > 0) throw { status: 400, message: 'Registration number already exists' };

    const res = await client.query(
      `INSERT INTO vehicles (vehicle_name, type, registration_number, daily_rent_price, availability_status)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [vehicle_name, type, registration_number, daily_rent_price, availability_status]
    );

    return res.rows[0];
  } finally {
    client.release();
  }
};

// Get all vehicles
export const getAll = async (): Promise<Vehicle[]> => {
  const client = await pool.connect();
  try {
    const res = await client.query('SELECT * FROM vehicles ORDER BY created_at DESC');
    return res.rows;
  } finally {
    client.release();
  }
};

// Get vehicle by ID
export const getById = async (vehicleId: number | string): Promise<Vehicle | null> => {
  const client = await pool.connect();
  try {
    const res = await client.query('SELECT * FROM vehicles WHERE id = $1', [vehicleId]);
    return res.rows[0] || null;
  } finally {
    client.release();
  }
};

// Update vehicle
export const update = async (vehicleId: number | string, payload: Partial<VehiclePayload>): Promise<Vehicle> => {
  const client = await pool.connect();
  try {
    const allowedFields: (keyof VehiclePayload)[] = [
      'vehicle_name',
      'type',
      'registration_number',
      'daily_rent_price',
      'availability_status',
    ];

    const fields: string[] = [];
    const values: any[] = [];

    allowedFields.forEach((key) => {
      if (key in payload) {
        values.push(payload[key]!);
        fields.push(key);
      }
    });

    if (fields.length === 0) throw { status: 400, message: 'No fields to update' };

    const setClause = fields.map((f, i) => `${f} = $${i + 1}`).join(', ');
    const query = `UPDATE vehicles SET ${setClause} WHERE id = $${fields.length + 1} RETURNING *`;

    const res = await client.query(query, [...values, vehicleId]);
    if ((res.rowCount ?? 0) === 0) throw { status: 404, message: 'Vehicle not found' };

    return res.rows[0];
  } finally {
    client.release();
  }
};

// Delete vehicle
export const deleteVehicle = async (vehicleId: number | string): Promise<void> => {
  const client = await pool.connect();
  try {
    const chk = await client.query(
      'SELECT id FROM bookings WHERE vehicle_id = $1 AND status = $2 LIMIT 1',
      [vehicleId, 'active']
    );
    if ((chk.rowCount ?? 0) > 0) throw { status: 400, message: 'Cannot delete vehicle with active bookings' };

    await client.query('DELETE FROM vehicles WHERE id = $1', [vehicleId]);
  } finally {
    client.release();
  }
};

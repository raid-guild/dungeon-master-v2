import axios from 'axios';

// standardize client within these requests
// catch errors

export const allInvoices = async () => {
  const { data } = await axios.post('/api/all-invoice');
  return data;
};

export const validateRaidId = async (raidId: string) => {
  const { data } = await axios.post('/api/validate', { raidId });
  return data;
};

export const updateRaidInvoice = async (
  raidId: string,
  invoiceAddress: string
) => {
  const { data } = await axios.post(`/api/invoice-create`, {
    raidId,
    invoiceAddress,
  });
  return data;
};

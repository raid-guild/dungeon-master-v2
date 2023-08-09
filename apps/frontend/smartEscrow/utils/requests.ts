import axios from 'axios';

export const allInvoices = async () => {
  const { data } = await axios.post('/api/all-invoice');
  return data;
};

export const validateRaidId = async (raidId) => {
  const { data } = await axios.post('/api/validate', { raidId });
  return data;
};

export const updateRaidInvoice = async (raidId, invoiceAddress) => {
  const { data } = await axios.post(`/api/invoice-create`, {
    raidId,
    invoiceAddress
  });
  return data;
};

export const notifyRaidSpoils = async (
  token,
  raidPartyShare,
  guildShare,
  txLink
) => {
  const { data } = await axios.post('/notify-spoils', {
    token,
    raidPartyShare,
    guildShare,
    txLink
  });
  return data;
};

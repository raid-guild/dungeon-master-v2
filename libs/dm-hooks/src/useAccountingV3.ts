import { useState } from 'react';

// this is a dummy hook
const useAccountingV3 = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  return { data: null, loading: false, error: null };
};

export default useAccountingV3;

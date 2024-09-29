import { useState, useCallback } from 'react';
import axios from 'axios';
import { ConfigSelectionData, FetchDataResponse } from "../Configurator/types";

export const useSeatingConfiguratorState = (configId: string, seating: any) => {
  const [configSelected, setConfigSelected] = useState<ConfigSelectionData>({
    color: seating?.option1OptionsCollection[0]?.value,
    seating: seating?.sofa.option2OptionsCollection[0],
  });

  const [additionalConfig, setAdditionalConfig] = useState<FetchDataResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchAdditionalConfig = useCallback(async () => {
    try {
      const response = await axios.get<FetchDataResponse>(`/api/configuration/${configId}`);
      setAdditionalConfig(response.data);
    } catch (error) {
      setErrorMessage('Failed to fetch configuration data');
    } finally {
      setIsLoading(false);
    }
  }, [configId]);

  return {
    configSelected,
    setConfigSelected,
    errorMessage,
    setErrorMessage,
    isLoading,
    additionalConfig,
    fetchAdditionalConfig,
  };
};
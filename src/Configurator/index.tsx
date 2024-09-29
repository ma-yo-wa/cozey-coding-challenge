import { useRouter } from "next/router";
import React, { useEffect, useMemo } from "react";
import {
  SeatingWrapper,
  AddToCartButton,
  AddToCartContainer,
  ErrorMessage,
  Loader,
} from "./styles";
import { handleconfig } from "./types";
import ConfigSelector from "../Common/ConfigSelector";
import { calculateCozeyCarePrice } from "../helpers/calculateCozeyCarePrice";
import { useSeatingConfiguratorState } from "../hooks/useSeatingConfiguratorState";
import { useAddToCart } from "../hooks/useAddToCart";

export const SeatingConfigurator = ({
  seating,
  config,
  price,
  colorsData,
  configId,
}: any) => {
  const router = useRouter();

  const {
    configSelected,
    setConfigSelected,
    errorMessage,
    setErrorMessage,
    additionalConfig,
    fetchAdditionalConfig,
    isLoading,
  } = useSeatingConfiguratorState(configId, seating);

  const {
    addToCart,
    isAddingToCart,
    error: cartError,
  } = useAddToCart();

  useEffect(() => {
    fetchAdditionalConfig();
  }, [fetchAdditionalConfig]);

  const handleConfig = (configType: 'color' | 'seating', value: string) => {
    setConfigSelected((prev) => ({
      ...prev,
      [configType]: value,
    }));
  };

  const totalPrice = useMemo(() => {
    return price.value + calculateCozeyCarePrice(config.priceUsd);
  }, [price, config]);

  const handleAddToCart = () => {
    addToCart({
      quantity: 1,
      variantId: configId,
      options: {
        color: configSelected.color,
        seating: configSelected.seating,
      },
    });
  };

  if (isLoading) return <Loader>Loading configurations...</Loader>;
  if (!additionalConfig)
    return <ErrorMessage>No configuration data available</ErrorMessage>;

  return (
    <SeatingWrapper>
      <ConfigSelector
        label="Select Color"
        selectedValue={configSelected.color}
        onChange={(value) => handleConfig('color', value)}
        options={colorsData}
      />
      <ConfigSelector
        label="Select Seating Option"
        selectedValue={configSelected.seating}
        onChange={(value) => handleConfig('seating', value)}
        options={additionalConfig.seatingOptions}
      />
      {cartError && <ErrorMessage>{cartError}</ErrorMessage>}
      <AddToCartContainer>
        <AddToCartButton
          type="button"
          onClick={handleAddToCart}
          disabled={isAddingToCart}
        >
          {isAddingToCart
            ? "Adding to Cart..."
            : `Add to Cart - $${totalPrice}`}
        </AddToCartButton>
      </AddToCartContainer>
    </SeatingWrapper>
  );
};

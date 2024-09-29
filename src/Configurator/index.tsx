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
import ColorSelector from "../Common/ColorSelector";
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

  const { addToCart, isAddingToCart, error: cartError, setError: setCartError } = useAddToCart();

  useEffect(() => {
    fetchAdditionalConfig();
  }, [fetchAdditionalConfig]);


  const handleConfig = ({ color, seating }: handleconfig) => {
    setConfigSelected((oldSelected) => ({
      ...oldSelected,
      color: color || oldSelected.color,
      seating: seating || oldSelected.seating,
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

  return (
    <SeatingWrapper>
      {isLoading ? (
        <Loader>Loading configurations...</Loader>
      ) : additionalConfig ? (
        <>
          <ColorSelector
            selectedColor={configSelected.color || ""}
            setColor={(color) =>
              handleConfig({
                color: color.value,
              })
            }
            colors={colorsData}
          />
          <div>
            <label>Select Seating Option</label>
            <select
              value={configSelected.seating || ""}
              onChange={(e) => handleConfig({ seating: e.target.value })}
            >
              {additionalConfig.seatingOptions.map((option) => (
                <div key={option.value}>
                  <option value={option.value}>{option.title}</option>
                </div>
              ))}
            </select>
          </div>
          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
          <AddToCartContainer>
            <AddToCartButton type="button" onClick={handleAddToCart}>
              Add to Cart - ${totalPrice}
            </AddToCartButton>
          </AddToCartContainer>
        </>
      ) : (
        <ErrorMessage>
          {errorMessage || "No configuration data available"}
        </ErrorMessage>
      )}
    </SeatingWrapper>
  );
};

import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import {
  SeatingWrapper,
  AddToCartButton,
  AddToCartContainer,
  ErrorMessage,
  Loader,
} from "./styles";
import axios from "axios";
import { handleconfig } from "./types";
import { useCartMutation } from "../hooks/useCartMutation";
import ColorSelector from "../Common/ColorSelector";
import { calculateCozeyCarePrice } from "../helpers/calculateCozeyCarePrice";
import { useSeatingConfiguratorState } from "../hooks/useSeatingConfiguratorState";

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

  useEffect(() => {
    fetchAdditionalConfig();
  }, [fetchAdditionalConfig]);

  const { addToCart } = useCartMutation();

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
    if (!configSelected.color || !configSelected.seating) {
      setErrorMessage("Please select both a color and a seating option");
      return;
    }
    setErrorMessage(null);

    addToCart({
      quantity: 1,
      variantId: configId,
      options: {
        color: configSelected.color,
        seating: configSelected.seating,
      },
    })
      .then(() => {
        router.push("/cart");
      })
      .catch(() => {
        setErrorMessage("Failed to add item to cart");
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

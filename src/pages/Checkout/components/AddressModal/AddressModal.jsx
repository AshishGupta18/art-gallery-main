import "./AddressModal.css";
import React, { useState } from "react";
import { addAddressService } from "../../../../services/address-services/addAddressService";
import { updateAddressService } from "../../../../services/address-services/updateAddressService";
import { useUserData } from "../../../../contexts/UserDataProvider.js";
import { useAddress } from "../../../../contexts/AddressProvider.js";
import { useAuth } from "../../../../contexts/AuthProvider.js";
import { toast } from "react-hot-toast";

export const AddressModal = () => {
  const [, setLoading] = useState(false);
  const [, setError] = useState("false");
  const { auth } = useAuth();
  const { dispatch } = useUserData();
  const { setIsAddressModalOpen, addressForm, setAddressForm, isEdit, setIsEdit } = useAddress();

  const [formErrors, setFormErrors] = useState({});

  const dummyAddress = {
    name: "Aniket Saini",
    street: "66/6B Main Post Office",
    city: "Roorkee",
    state: "Uttarakhand",
    country: "India",
    pincode: "247667",
    phone: "9639060737",
  };

  const validateForm = () => {
    const errors = {};
    if (!addressForm.name || addressForm.name.trim().length < 3) {
      errors.name = "Name must be at least 3 characters.";
    }
    if (!addressForm.street || addressForm.street.trim().length < 5) {
      errors.street = "Street must be at least 5 characters.";
    }
    if (!addressForm.city) {
      errors.city = "City is required.";
    }
    if (!addressForm.state) {
      errors.state = "State is required.";
    }
    if (!addressForm.country) {
      errors.country = "Country is required.";
    }
    if (!/^\d{5,10}$/.test(addressForm.pincode)) {
      errors.pincode = "Pincode must be 5 to 10 digits.";
    }
    if (!/^\d{8,14}$/.test(addressForm.phone)) {
      errors.phone = "Phone number must be 8 to 14 digits.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return; // stop submission if invalid

    if (!isEdit) {
      await addAddress(addressForm);
    } else {
      await updateAddress(addressForm);
      setIsEdit(false);
    }
    setAddressForm({
      name: "",
      street: "",
      city: "",
      state: "",
      country: "",
      pincode: "",
      phone: "",
    });
    setIsAddressModalOpen(false);
  };

  const addAddress = async (address) => {
    try {
      setLoading(true);
      setError("");
      const response = await addAddressService(address, auth.token);
      if (response.status === 201) {
        setLoading(false);
        toast.success("New address added successfully!");
        dispatch({ type: "SET_ADDRESS", payload: response.data.addressList });
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateAddress = async (address) => {
    try {
      setLoading(true);
      setError("");
      const response = await updateAddressService(address, auth.token);
      if (response.status === 200) {
        setLoading(false);
        toast.success(`${address.name}'s address updated successfully!`);
        dispatch({ type: "SET_ADDRESS", payload: response.data.addressList });
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="address-modal-container">
      <div className="address-input-container">
        <h1>Address Form</h1>
        <form onSubmit={handleSubmit} className="input-container">
          <input
            name="name"
            value={addressForm.name}
            onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
            placeholder="Enter Name"
          />
          {formErrors.name && <p className="error">{formErrors.name}</p>}

          <input
            value={addressForm.street}
            onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
            placeholder="Enter Street"
          />
          {formErrors.street && <p className="error">{formErrors.street}</p>}

          <input
            name="city"
            value={addressForm.city}
            onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
            placeholder="Enter City"
          />
          {formErrors.city && <p className="error">{formErrors.city}</p>}

          <input
            name="state"
            value={addressForm.state}
            onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
            placeholder="Enter State"
          />
          {formErrors.state && <p className="error">{formErrors.state}</p>}

          <input
            name="country"
            value={addressForm.country}
            onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
            placeholder="Enter Country"
          />
          {formErrors.country && <p className="error">{formErrors.country}</p>}

          <input
            name="pincode"
            value={addressForm.pincode}
            onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
            placeholder="Enter Pincode"
          />
          {formErrors.pincode && <p className="error">{formErrors.pincode}</p>}

          <input
            name="phone"
            value={addressForm.phone}
            onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
            placeholder="Enter Phone"
          />
          {formErrors.phone && <p className="error">{formErrors.phone}</p>}

          <input className="submit" type="submit" value="Save" />
        </form>

        <div className="btn-container">
          <button onClick={() => setIsAddressModalOpen(false)}>Cancel</button>
          <button onClick={() => setAddressForm({ ...dummyAddress })}>Add Dummy Data</button>
        </div>
      </div>
    </div>
  );
};
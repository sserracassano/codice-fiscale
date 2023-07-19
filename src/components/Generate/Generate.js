import React from "react";
import { useState, useRef } from "react";
import { generateModel } from "../../constants/generateModel";
import { monthToCode } from "../../constants/monthToCode";
import { Field } from "../Field/Field";
import {
  Form,
  Button,
  DatePicker,
  Stack,
  SelectPicker,
  RadioTileGroup,
  RadioTile,
  Tag,
} from "rsuite";

export const Generate = ({ codiceFiscale, onDataUpdate, comuni, province }) => {
  const formRef = useRef();
  const [formError, setFormError] = useState({});
  const [formValue, setFormValue] = useState({
    lastName: "",
    firstName: "",
    sex: "",
    city: "",
    province: "",
    dateOfBirth: null,
  });

  const calcName = (name, type) => {
    const vowelsRegex = /[aeiouàèéìòù]/gi;
    const consonantsRegex = /[^aeiouàèéìòù\W_]/gi;

    const vowelsArray = name.match(vowelsRegex);
    const vowels =
      vowelsArray && vowelsArray.length > 1
        ? vowelsArray.join("").toUpperCase()
        : "";

    const consonantsArray = name.match(consonantsRegex);
    const consonants =
      consonantsArray && consonantsArray.length > 1
        ? consonantsArray.join("").toUpperCase()
        : "";

    switch (true) {
      case name.length === 2:
        return (name + "x").toUpperCase();
      case consonants.length < 3:
        return consonants + vowels[0];
      case consonants.length > 2 && consonants.length < 4:
        return consonants.slice(0, 3);
      case consonants.length > 3 && type === "firstName":
        return consonants[0] + consonants.slice(2, 4);
      case consonants.length > 3 && type === "lastName":
        return consonants.slice(0, 3);
      default:
        break;
    }
  };

  const calcMonthYear = (date) => {
    const years = date.getFullYear().toString().slice(-2);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const monthCode = monthToCode[month];
    return years + monthCode;
  };

  const calcDays = (date, sex) => {
    if (sex === "Female") {
      return Number(date.getDate().toString().padStart(2, "0")) + 40;
    } else {
      return date.getDate().toString().padStart(2, "0");
    }
  };

  const handleSubmit = () => {
    if (!formRef.current.check()) {
      console.log("Ci sono degli errori");
      return;
    }

    onDataUpdate(
      calcName(formValue.lastName, "lastName") +
        calcName(formValue.firstName, "firstName") +
        calcMonthYear(formValue.dateOfBirth) +
        calcDays(formValue.dateOfBirth, formValue.sex) +
        formValue.city
    );
  };

  return (
    <div className="Generate">
      {codiceFiscale ? (
        <Tag size="lg" style={{ padding: "8px", margin: "16px" }}>
          {" "}
          Il tuo codice fiscale è: {codiceFiscale}
        </Tag>
      ) : (
        <Tag size="lg" style={{ padding: "8px", margin: "16px" }}>
          Inserisci i dati nella form per calcolare il codice fiscale
        </Tag>
      )}
      <Stack direction="column">
        <Form
          ref={formRef}
          onChange={setFormValue}
          onCheck={setFormError}
          formValue={formValue}
          model={generateModel}
        >
          <Field
            name="firstName"
            label="Nome"
            error={formError.firstName}
            placeholder="Inserisci il nome"
          />
          <Field
            name="lastName"
            label="Cognome"
            error={formError.lastName}
            placeholder="Inserisci il cogome"
          />
          <Field
            name="city"
            label="Comune di Nascita"
            accepter={SelectPicker}
            error={formError.city}
            data={comuni}
            placeholder="Seleziona la città di nascita"
          />

          <Field
            name="province"
            label="Provincia"
            accepter={SelectPicker}
            error={formError.province}
            data={province}
            placeholder="Seleziona la provincia"
          />

          <Field
            name="sex"
            label="Sesso"
            accepter={RadioTileGroup}
            error={formError.sex}
            inline
            defaultValue="blank"
            placeholder="Seleziona il sesso"
          >
            <RadioTile value={"Male"}>Maschio</RadioTile>
            <RadioTile value={"Female"}>Femmina</RadioTile>
          </Field>

          <Field
            accepter={DatePicker}
            oneTap
            format="dd-MM-yyyy"
            name="dateOfBirth"
            label="Data di nascita"
            errorMessage={formError.dateOfBirth}
            placeholder="Inserisci la data di nascita"
          />

          <Button appearance="primary" onClick={handleSubmit}>
            Calcola Codice Fiscale
          </Button>
        </Form>
      </Stack>
    </div>
  );
};

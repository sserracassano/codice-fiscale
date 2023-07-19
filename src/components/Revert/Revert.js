import React from "react";
import { revertModel } from "../../constants/revertModel";
import { codeToMonth } from "../../constants/codeToMonth";
import { Field } from "../Field/Field";
import { Form, Button, Stack, Tag } from "rsuite";
import { useState } from "react";

export const Revert = ({ datiPersonali, onDataUpdate, comuni }) => {
  const formRef = React.useRef();
  const [formError, setFormError] = useState({});
  const [formValue, setFormValue] = useState({
    codiceFiscale: "",
  });

  const decodeMonthYear = (codiceFiscale) => {
    const yearDigits = codiceFiscale.slice(6, 8);
    const monthCode = codiceFiscale[8].toUpperCase();
    const currentYear = new Date().getFullYear().toString().slice(-2);
    const year =
      yearDigits >= 0 && yearDigits <= currentYear
        ? "20" + yearDigits
        : "19" + yearDigits;
    const month = codeToMonth[monthCode];

    return month + "/" + year;
  };

  const decodeDaySex = (codiceFiscale) => {
    const daysDigits = codiceFiscale.slice(9, 11);
    if (daysDigits > 31) {
      return { days: daysDigits - 40, sex: "Femmina" };
    } else {
      return { days: daysDigits, sex: "Maschio" };
    }
  };

  const decodeCity = (codiceFiscale) => {
    const cityDigits = codiceFiscale.slice(11, 15).toUpperCase();
    const city = comuni.find((city) => city.value === cityDigits);
    return city.label;
  };

  const handleSubmit = () => {
    if (!formRef.current.check()) {
      console.log("Ci sono degli errori");
      return;
    }

    onDataUpdate({
      dateOfBirth:
        decodeDaySex(formValue.codiceFiscale).days +
        "/" +
        decodeMonthYear(formValue.codiceFiscale),
      sex: decodeDaySex(formValue.codiceFiscale).sex,
      city: decodeCity(formValue.codiceFiscale),
    });
  };

  return (
    <div className="Field">
      <Stack direction="column">
        {datiPersonali ? (
          <>
            <Tag size="lg" style={{ padding: "8px", margin: "16px" }}>
              Il sesso è: {datiPersonali.sex}
            </Tag>
            <Tag size="lg" style={{ padding: "8px", margin: "16px" }}>
              La data di nascita è: {datiPersonali.dateOfBirth} *
            </Tag>
            <Tag size="lg" style={{ padding: "8px", margin: "16px" }}>
              Il luogo di nascita è: {datiPersonali.city}
            </Tag>
          </>
        ) : (
          <Tag size="lg" style={{ padding: "8px", margin: "16px" }}>
            Inserisci i dati nella form per ricavare i dati personali
          </Tag>
        )}
        <Form
          ref={formRef}
          onChange={setFormValue}
          onCheck={setFormError}
          formValue={formValue}
          model={revertModel}
        >
          <Field
            name="codiceFiscale"
            label="Codice Fiscale"
            error={formError.codiceFiscale}
          />

          <Button appearance="primary" onClick={handleSubmit}>
            Ricava i Dati
          </Button>
        </Form>
        <div style={{ fontSize: "10px", padding: "16px" }}>
          * Si presuppone che l'età della persona sia compresa tra 0 e 100 anni.
          Se la persona ha più di 100 anni la data corretta non sarà "20XX" ma
          "19XX".
        </div>
      </Stack>
    </div>
  );
};

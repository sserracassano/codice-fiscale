import { Schema } from "rsuite";

const { StringType } = Schema.Types;

export const revertModel = Schema.Model({
  codiceFiscale: StringType()
    .pattern(
      /^[A-Z]{6}\d{2}[A-EHLMPRST]\d{2}[A-Z]\d{3}[A-Z]$/i,
      "Per favore inserisci un Codice Fiscale valido"
    )
    .isRequired("Per favore inserire il Codice Fiscale"),
});

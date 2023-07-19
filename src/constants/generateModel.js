import { Schema } from "rsuite";

const { StringType, DateType } = Schema.Types;

export const generateModel = Schema.Model({
  lastName: StringType()
    .minLength(2, "Inserire almeno 2 caratteri")
    .pattern(
      /^[a-zA-ZÀ-ÿ\s"'-]+$/,
      "Per favore inserisci caratteri legalmente riconosciuti"
    )
    .isRequired("Per favore inserire il Cognome"),
  firstName: StringType()
    .minLength(2, "Inserire almeno 2 caratteri")
    .pattern(
      /^[a-zA-ZÀ-ÿ\s"'-]+$/,
      "Per favore inserisci caratteri legalmente riconosciuti"
    )
    .isRequired("Per favore inserire il Nome"),
  city: StringType().isRequired("Per favore seleziona il Comune di Nascita"),
  sex: StringType()
    .isOneOf(["Male", "Female"], "Seleziona uno tra maschio e femmina")
    .isRequired("Per favore selezionare il Sesso"),
  province: StringType()
    .rangeLength(2, 2, "Per favore inserire due caratteri")
    .isRequired("Per favore inserire la Provincia"),
  dateOfBirth: DateType()
    .range(
      new Date(new Date().setFullYear(new Date().getFullYear() - 200)),
      new Date(),
      "Le date disponibili sono dal 1900 a oggi"
    )
    .isRequired("Per favore selezionare la Data di Nascita"),
});

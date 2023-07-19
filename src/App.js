import "./App.css";
import "rsuite/dist/rsuite.min.css";
import { Generate } from "./components/Generate/Generate";
import { Revert } from "./components/Revert/Revert";
import { Stack, RadioTileGroup, RadioTile } from "rsuite";
import { useState, useEffect } from "react";

function App() {
  const [mode, setMode] = useState("dataToCf");
  const [codiceFiscale, setCodiceFiscale] = useState("");
  const [datiPersonali, setDatiPersonali] = useState(null);
  const [comuni, setComuni] = useState([]);
  const [province, setProvince] = useState([]);

  useEffect(() => {
    fetch("https://axqvoqvbfjpaamphztgd.functions.supabase.co/comuni")
      .then((response) => response.json())
      .then((data) => {
        const comuniMappati = data.map((item) => {
          return {
            label: item.nome,
            value: item.codiceCatastale,
          };
        });
        setComuni(comuniMappati);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  useEffect(() => {
    fetch("https://axqvoqvbfjpaamphztgd.functions.supabase.co/province")
      .then((response) => response.json())
      .then((data) => {
        const provinceMappate = data.map((item) => {
          return {
            label: item.sigla,
            value: item.sigla,
          };
        });
        setProvince(provinceMappate);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  const handleCodiceFiscale = (data) => {
    setCodiceFiscale(data);
  };

  const handleDatiPersonali = (data) => {
    setDatiPersonali(data);
  };

  return (
    <div className="App" style={{ padding: "32px" }}>
      <Stack direction="column">
        <RadioTileGroup
          inline
          defaultValue="dataToCf"
          aria-label="Visibility Level"
        >
          <RadioTile
            label="Calcola il Codice Fiscale"
            value="dataToCf"
            onChange={() => setMode("dataToCf")}
          >
            Inserisci i tuoi dati e calcolati il Codice Fiscale
          </RadioTile>
          <RadioTile
            label="Ricava i dati"
            value="cfToData"
            onChange={() => setMode("cfToData")}
          >
            Inserisci il Codice Fiscale e ricavane le informazioni
          </RadioTile>
        </RadioTileGroup>

        {mode === "dataToCf" ? (
          <Generate
            onDataUpdate={handleCodiceFiscale}
            codiceFiscale={codiceFiscale}
            comuni={comuni}
            province={province}
          />
        ) : (
          <Revert
            datiPersonali={datiPersonali}
            onDataUpdate={handleDatiPersonali}
            comuni={comuni}
          />
        )}
      </Stack>
    </div>
  );
}
export default App;

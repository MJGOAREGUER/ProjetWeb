import '../App.css';
import { useEffect, useState } from 'react';

function Modal(){
    const [city, setCity] = useState("Paris");
    const [data, setData] = useState(null);
    const [err, setErr] = useState(null);
    const apiKey = process.env.REACT_APP_OWM_KEY;

    useEffect(() => {
        if(!apiKey) {
            setErr("Clé API introuvable!");
            return;
        }

        const url = `https://api.openweathermap.org/data/2.5/weather?q=Paris&units=metric&lang=fr&appid=${apiKey}`;

        fetch(url)
            .then((r) => {
              if(!r.ok) throw new Error("Erreur réseau : " + r.status);
              return r.json();  
            })
            .then(setData)
            .catch(setErr);
    }, [city, apiKey]);

    if(err) return <div>Erreur: {String(err)}</div>;
    if(!data) return <div>Chargement</div>;

    return(
        <div className="fixed inset-0 flex justify-center items-center">
            <div className="backdrop-blur-sm bg-white/10 rounded-xl p-6">
                <h2>Application météo</h2>
            </div>
        </div>
    );
}

export default Modal;
import { Card } from "primereact/card"; //trzy karty primereacta
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";

export function SingleParameterCard(props: any) { // props = paczka z ustawieniami dla tej konkretnej karty
    const morski = '#5c7e7b';

    return (
        <Card style={{ borderLeft: '10px solid ' + morski, marginBottom: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>

                <div style={{ flexGrow: 1, paddingRight: '20px' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{props.label}</div> {/* Tytuł karty */}
                    <small style={{ color: '#666' }}>{props.description}</small> {/* Opis karty*/}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}> {/* Sekcja z inputem i przyciskiem */}
                    <InputNumber
                        value = {props.value} // wartość z propsów
                        onValueChange = {function(e) { props.onChange(e.value); }} // zmiana wartości
                        suffix = {props.suffix}
                        mode = {props.mode}
                        currency = "PLN"
                        showButtons = {false}
                        inputStyle = {{
                            width: '120px',
                            padding: '10px',
                            border: '1px solid #ccc',
                            borderRadius: '6px',
                            textAlign: 'right'
                        }}
                    />

                    <Button
                        icon="pi pi-check"
                        onClick={props.onSave} // funkcja zapisu z propsów
                        style={{
                            background: morski,
                            border: 'none',
                            height: '42px',
                            width: '42px'
                        }}
                    />

                </div>
            </div>
        </Card>
    );
}
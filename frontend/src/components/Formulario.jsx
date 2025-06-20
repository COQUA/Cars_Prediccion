import { useState } from "react"

export default function Formulario() {
    const [formData, setFormDatos] = useState({
        make_year: '',
        mileage_kmpl: '',
        engine_cc: '',
        fuel_type: 'Petrol',
        transmission: 'Manual',
        owner_count: '',
        insurance_valid: false
    })

    const [prediccion, setPrediccion] = useState(null)
    const [error, setError] = useState(null)

    const handleChange = (e) =>{
        const { name, value, type, checked } = e.target
        setFormDatos(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await fetch('http://localhost:8000/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...formData,
                    make_year: parseInt(formData.make_year),
                    mileage_kmpl: parseFloat(formData.mileage_kmpl),
                    engine_cc: parseFloat(formData.engine_cc),
                    owner_count: parseInt(formData.owner_count),
                    insurance_valid: Boolean(formData.insurance_valid)
                })
            })

            if (!response.ok) throw new Error('Error al obtener predicción')

            const data = await response.json()
            setPrediccion(data.predicted_price_usd.toFixed(2))
            setError(null)
        } catch (error) {
            setError(error.message)
            setPrediccion(null)
        }
    }

    return(
        <div>
            <h2>Predicción de auto usado</h2>
            <form onSubmit={handleSubmit}>
                <p>Año del auto:</p><input type="number" name="make_year" placeholder="Año del auto" value={formData.make_year} onChange={handleChange} required/>
                <p>Kilometraje:</p><input type="number" step="0.1" name="mileage_kmpl" placeholder="Kilometraje (km/l)" value={formData.mileage_kmpl} onChange={handleChange} required/>
                <p>Cilindradas de motor:</p><input type="number" name="engine_cc" placeholder="Motor (cc)" value={formData.engine_cc} onChange={handleChange} required/>

                <p>Tipo de Combustible</p><select name="fuel_type" value={formData.fuel_type} onChange={handleChange}>
                    <option value="Petrol">Nafta</option>
                    <option value="Diesel">Diésel</option>
                    <option value="Electric">Eléctrico</option>
                </select>

                <p>Tipo de transmisión</p><select name="transmission" value={formData.transmission} onChange={handleChange}>
                    <option value="Manual">Manual</option>
                    <option value="Automatic">Automático</option>
                </select>

                <p>Cantidad de dueños</p><input type="number" name="owner_count" placeholder="Cantidad de dueños anteriores" value={formData.owner_count} onChange={handleChange} required/>
                <label>
                    <p>Seguro</p><input type="checkbox" name="insurance_valid" checked={formData.insurance_valid} onChange={handleChange}/>
                    Tiene seguro vigente
                </label><br/><br />

                <button type="submit">Predecir precio</button>
            </form>

            {prediccion && (
                <p>Precio estimado: <strong>${prediccion} USD</strong></p>
            )}
            {error && <p style={{color:'red'}}>{error}</p>}
        </div>
    )
}
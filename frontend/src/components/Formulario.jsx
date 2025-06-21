import { useState} from "react"

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
    const [r2Score, setR2Score] = useState(null)

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

            await obtenerInfoModelo()

        } catch (error) {
            setError(error.message)
            setPrediccion(null)
            setR2Score(null)
        }
    }

    const obtenerInfoModelo  = async () => {
        try {
            const response = await fetch('http://localhost:8000/model_info')
            if(!response.ok) throw new Error('No se pudo obtener información del modelo')
            const data = await response.json()
            setR2Score(data.r2_score)
        } catch (error) {
            console.error('Error al obtener métricas del modelo:', error.message)
        }
    }

    return(
        <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4">
            <div className="w-full max-w-xl bg-gray-800 p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-center">Predicción de auto usado</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block">Año del auto:</label>
                    <input type="number" name="make_year" placeholder="Año del auto" value={formData.make_year} onChange={handleChange} className="w-full p-2 bg-gray-700 border border-gray-600 rounded" required/>
                </div>

                <div>
                    <label className="block">Kilometraje:</label>
                    <input type="number" step="0.1" name="mileage_kmpl" placeholder="Kilometraje (km/l)" value={formData.mileage_kmpl} onChange={handleChange} required className="w-full p-2 bg-gray-700 border border-gray-600 rounded"/>
                </div>

                <div>
                    <label className="block">Cilindradas de motor:</label>
                    <input type="number" name="engine_cc" placeholder="Motor (cc)" value={formData.engine_cc} onChange={handleChange} required className="w-full p-2 bg-gray-700 border border-gray-600 rounded"/>
                </div>

                <div>
                    <label className="block">Tipo de Combustible</label>
                    <select name="fuel_type" value={formData.fuel_type} onChange={handleChange} className="w-full p-2 bg-gray-700 border border-gray-600 rounded">
                        <option value="Petrol">Nafta</option>
                        <option value="Diesel">Diésel</option>
                        <option value="Electric">Eléctrico</option>
                    </select>
                </div>

                <div>
                    <label className="block">Tipo de transmisión:</label>
                    <select name="transmission" value={formData.transmission} onChange={handleChange} className="w-full p-2 bg-gray-700 border border-gray-600 rounded">
                        <option value="Manual">Manual</option>
                        <option value="Automatic">Automático</option>
                    </select>
                </div>

                <div>
                    <label className="block">Cantidad de dueños anteriores:</label>
                    <input type="number" name="owner_count" placeholder="Cantidad de dueños anteriores" value={formData.owner_count} onChange={handleChange} required className="w-full p-2 bg-gray-700 border border-gray-600 rounded"/>
                </div>

                <div className="flex items-center">
                    <input type="checkbox" name="insurance_valid" checked={formData.insurance_valid} onChange={handleChange} className="mr-2"/>
                    <label>Tiene seguro vigente</label>
                </div>

                <button type="submit" className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-semibold transition">Predecir precio</button>
            </form>

            {prediccion && (
                <p className="mt-6 text-lg text-green-400 text-center">Precio estimado: <strong>${prediccion} USD</strong></p>
            )}
            {r2Score && (
                <p className="mt-2 text-sm text-center text-gray-400">Predicción del modelo (R²): <strong>{(r2Score * 100).toFixed(2)}%</strong></p>
            )}
            {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
            </div>
        </div>
    )
}
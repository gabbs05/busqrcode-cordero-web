"use client";
import { Input, Divider, Button, Textarea, TimeInput, Checkbox, Card, CardBody, CardHeader, CardFooter, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue, Link, Select, SelectItem,
} from "@heroui/react";
import { Time } from "@internationalized/date";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface UnidadesProps {
  rutas?: any;
  fiscales?: any;
}

export default function Horarios_add({ rutas, fiscales }: UnidadesProps) {
  const router = useRouter();
  const rut = JSON.parse(rutas);
  const fis = JSON.parse(fiscales);
  const [selectedRuta, setSelectedRuta] = useState("");
  const [horas, setHoras] = useState<any[]>([]);
  const [nombre, setNombre] = useState("");
  console.log(horas)

  let ruta: any
  let fiscRuta: any[] = [];
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
        const response = await axios.post("/api/horarios", {nombre: nombre, ruta_id: selectedRuta, horas});
        console.log(response)
        if (response && response.status === 200) {
            toast.success('Horario Agregado', {
                onClose: () => router.push('/horarios')})
        }
        if (response && response.status == 401) {
            toast.error("Nombre de horario ya existe");
        }
    } catch (error) {
        console.log(error)
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            toast.error("Nombre de horario ya existe");
        }else{
            toast.error("Error al agregar el horario");
        }
    }
  };
  if (selectedRuta) {
    ruta = rut.filter((ruta: any) => ruta._id === selectedRuta);
    const fiscId = ruta[0].fiscales.map((fis: any) => fis.fiscal_id);
    fiscRuta = fis
      .filter((fis: any) => fiscId.includes(fis._id))
      .sort((a: any, b: any) => a.numero - b.numero);
  }

    const handleHoraChange = (index: number, field: string, value: any) => {
        const newHoras = [...horas];
        newHoras[index][field ] = value;
        setHoras(newHoras);
    };

  return (
    <>
      <div className="mb-10 rounded-sm border border-stroke dark:bg-slate-800 bg-slate-200 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex justify-center items-center m-10">
          <Card className="my-5 w-full">
            <CardBody className="m-2">
              <div className="m-5 ">
                <h1 className="text-xl font-bold">Agregar Horario</h1>
                <Divider />
                <div className="my-4 w-full">
                  <form onSubmit={handleSubmit} className=" pr-3 w-full gap-4">
                    <div className="flex flex-col lg:flex-row gap-4 m-3">
                      <div>
                        <label
                          htmlFor="ruta"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Seleccionar Ruta
                        </label>
                        <select
                          required   
                          id="ruta"
                          name="ruta"
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-black focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                          value={selectedRuta}
                          onChange={(e) => setSelectedRuta(e.target.value)}
                        >
                          <option value="" disabled>
                            Elige una ruta
                          </option>
                          {rut.map((ruta: any) => (
                            <option key={ruta._id} value={ruta._id}>
                              {ruta.nombre}
                            </option>
                          ))}
                        </select>
                      </div>
                      {selectedRuta ? (
                        <>
                        <div>
                          <label
                            htmlFor="addHorario"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Añadir tiempo entre fiscales
                          </label>
                          <Button
                            onClick={() =>
                                setHoras([...horas, { FiscalA_id: "", FiscalB_id: "", tiempo_entre: '' }])
                            }
                            id="addHorario"
                            className="bg-emerald-600 mx-4"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={2}
                              stroke="currentColor"
                              className="w-12 h-12 text-gray-200"
                              >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 4.5v15m7.5-7.5h-15"
                                />
                            </svg>
                          </Button>
                        </div>
                        <div>
                            <label
                                htmlFor="nombre"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Nombre del Horario
                            </label>
                            <input
                                className="mt-1 block w-full pl-3 pr-2 py-2 text-base border border-black focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                type="text"
                                id="nombre"
                                name="nombre"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                required
                            />
                        </div>
                                </>
                      ) : (
                        ""
                      )}
                    </div>
                    {selectedRuta ? (
                      <div className="grid grid-cols- lg:grid-cols-2 gap-4 m-6">
                        {horas.length > 0
                          ? horas.map(
                              (hor:any, index:any) => (
                                <div
                                      className="relative bg-slate-200 p-4 rounded-md"
                                  key={index}
                                >
                                      <button
                                      type="button"
                                          onClick={() =>
                                              setHoras(horas.filter((_, i) => i !== index))
                                          }
                                          className="absolute top-2 right-2 w-4 h-4"
                                      >
                                          <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              fill="none"
                                              viewBox="0 0 24 24"
                                              stroke="currentColor"
                                              strokeWidth={2}
                                          >
                                              <path
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  d="M6 18L18 6M6 6l12 12"
                                              />
                                          </svg>
                                      </button>
                                    <h1 className="font-bold text-xl my-3">Horario {index+1}</h1>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label
                                        htmlFor="FiscalA"
                                        className="block text-sm font-medium text-gray-700"
                                      >
                                        Fiscal A
                                      </label>
                                      <select
                                        required
                                        id="FiscalA"
                                        name="FiscalA"
                                        className="mt-1 block w-full pl-3 pr-3 py-2 text-base border border-black focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                        value={horas[index].FiscalA_id}
                                        onChange={(e) => handleHoraChange(index, 'FiscalA_id', e.target.value)}
                                      >
                                        <option value="" disabled>
                                          Elige un fiscal
                                        </option>
                                        {fiscRuta.map((ruta: any) => (
                                          <option
                                            key={ruta._id}
                                            value={ruta._id}
                                          >
                                            {ruta.ubicacion}
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                    <div>
                                      <label
                                        htmlFor="FiscalB"
                                        className="block text-sm font-medium text-gray-700"
                                      >
                                        Fiscal B
                                      </label>
                                      <select
                                        required  
                                        id="FiscalB"
                                        name="FiscalB"
                                        className="mt-1 block w-full pl-3 pr-3 py-2 text-base border border-black focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                          value={horas[index].FiscalB_id}
                                        onChange={(e) => handleHoraChange(index, 'FiscalB_id', e.target.value)}
                                      >
                                        <option value="" disabled>
                                          Elige un fiscal
                                        </option>
                                        {fiscRuta.map((ruta: any) => (
                                          <option
                                            key={ruta._id}
                                            value={ruta._id}
                                          >
                                            {ruta.ubicacion}
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                    <div>
                                      <label
                                        htmlFor="tiempo_entre"
                                        className="block text-sm font-medium text-gray-700"
                                      >
                                        Tiempo en Minutos
                                      </label>
                                      <input
                                        className="mt-1 block w-full pl-3 pr-2 py-2 text-base border border-black focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                        type="number"
                                        id="tiempo_entre"
                                        name="tiempo_entre"
                                        min={1}
                                        value={horas[index].tiempo_entre}
                                        onChange={(e) => handleHoraChange(index, 'tiempo_entre', Number(e.target.value) )}
                                        required
                                              />
                                    </div>
                                  </div>
                                  
                                </div>
                              )
                            )
                          : ""}
                      </div>
                    ) : (
                      ""
                    )}

                    <div className="flex pt-4 ">
                      <Button
                        type="submit"
                        variant="shadow"
                        className="w-1/2 bg-green-700 text-slate-100 "
                      >
                        Agregar Horario
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
}

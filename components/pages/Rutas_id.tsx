"use client";
import {
    Card, CardHeader, CardBody, CardFooter, Divider, Image, Button, Input, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, RadioGroup, Radio, getKeyValue,
} from "@heroui/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axios from "axios";
import { useState, useEffect, Key } from "react";
import Link from "next/link";

interface Plantillas_Pizarras_idProps {
    ruta?: any;
    params?: any;
    fiscales?: any;
}

export default function Rutas_id({ ruta, params, fiscales}: Plantillas_Pizarras_idProps) {
    const fiscal = JSON.parse(fiscales);
    const rows = fiscal.sort((a: any, b: any) => a.numero - b.numero);
    const router = useRouter();
    const unid = JSON.parse(ruta);
    const rutId = params.rut;
    const [nombre, setNombre] = useState(unid.nombre);
    const [selectedKeys, setSelectedKeys] =useState(unid.fiscales.map((fiscal: any) => {return `${fiscal.fiscal_id}-${fiscal.numero_ruta}`}));
    console.log(selectedKeys)
    let values = []
    if(selectedKeys.size != 0  && selectedKeys.size != undefined){
        values = selectedKeys.entries().toArray().map((value: any) => value[1])
    }

    useEffect(() => {
        setNombre(unid.nombre);
    }, [unid.nombre]);

    const submitForm = async (e: any) => {
        e.preventDefault();
        const data = {
            nombre,
            id: rutId,
        };
        try {
            const response = await axios.put(`/api/rutas`, { ...data, _id: rutId });
            if (response.status === 400) {
                throw new Error("Error al editar la ruta");
            } else if (response.status == 401) {
                toast.error(response.data.error);
                console.log(response);
            } else if (response.status === 409) {
                console.log(response);
                toast.error("No se encuentra ninguna ruta con ese ID");
            } else if (response.status === 200) {
                toast.success("Ruta Editada", {
                    onClose: () => router.push("/rutas"),
                });
            }
        } catch (error) {
            console.log(error);
            if (axios.isAxiosError(error) && error.response) {
                toast.error(error.response.data.error);
            } else {
                toast.error("An unexpected error occurred");
            }
        }
    };

    const deletePizarra = async () => {
        const deletedPizarra = window.confirm(
            "¿Estás seguro de eliminar la Ruta, esta acción no se puede deshacer"
        );
        if (deletedPizarra) {
            try {
                const response = await axios.delete(`/api/rutas`, {
                    data: { id: rutId },
                });
                console.log(response);
                if (response.status == 200) {
                    toast.success("ruta eliminada con éxito", {
                        onClose: () => router.push("/rutas"),
                    });
                } else if (response.status == 409) {
                    console.log(response);
                    throw new Error("No se encuentra ninguna ruta con ese ID");
                }
            } catch (error) {
                console.log(error);
                toast.error("Error al eliminar la ruta");
            }
        }
        return;
    };

    const columns = [
        {
            key: "numero",
            label: "Número",
        },
        {
            key: "username",
            label: "Nombre de usuario",
        },
        {
            key: "ubicacion",
            label: "Ubicación",
        },
    ];
    const submitFiscales = async (e: any) => {
        if (selectedKeys.size == 0 || selectedKeys.size == undefined) {
            toast.error("No se ha seleccionado ningún fiscal");
            return
        }
        e.preventDefault();
        let fiscales: { fiscal_id: any; numero_ruta: any; }[] = []
        const confirm = window.confirm("¿Estás seguro de asignar estos fiscales a la ruta?");   
        if (confirm && selectedKeys != 0 && selectedKeys != undefined) {
            values.map(async (value: any) => {
                const [fiscal_id, numero_ruta] = value.split('-')
                console.log(fiscal_id, numero_ruta)
                const data = {
                    fiscal_id,
                    numero_ruta,
                };
                fiscales.push(data)
            })
            
            const fisc = fiscales.sort((a: any, b: any) => a.numero_ruta - b.numero_ruta)
            console.log(fisc)
                try {
                    const response = await axios.put(`/api/rutas/`, { fiscales: fisc, _id: rutId });
                    if (response.status === 400) {
                        throw new Error("Error al asignar los fiscales a la ruta");
                    } else if (response.status == 401) {
                        toast.error(response.data.error);
                        console.log(response);
                    } else if (response.status === 409) {
                        console.log(response);
                        toast.error("No se encuentra ninguna ruta con ese ID");
                    } else if (response.status === 200) {
                        toast.success("Fiscales asignados a la ruta", {
                            onClose: () => router.push('/rutas'),
                        });
                    }
                } catch (error) {
                    console.log(error);
                    if (axios.isAxiosError(error) && error.response) {
                        toast.error(error.response.data.error);
                    } else {
                        toast.error("An unexpected error occurred");
                    }
                }
        }

    }
    return (
        <>
            <div className="mb-10 rounded-sm border border-stroke dark:bg-slate-800 bg-slate-200 shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="flex flex-col justify-center items-center ">
                    <Card className="my-5 lg:w-1/2">
                        <CardBody className="m-2">
                            <div className="m-5 ">
                                <h1 className="text-xl font-bold">Editar ruta</h1>
                                <Divider />
                                <div className="my-4 w-full">
                                    <form
                                        onSubmit={submitForm}
                                        className="grid gap-4 pr-3 w-full"
                                    >
                                        <Input
                                            name="numero"
                                            isRequired
                                            required
                                            type="text"
                                            value={nombre}
                                            label="Nombre ruta"
                                            onChange={(e) => setNombre(e.target.value)}
                                        />
                                        <div className="grid grid-cols-2 gap-4 justify-center items-center">
                                            <Button
                                                type="submit"
                                                variant="shadow"
                                                className="w-full bg-green-700 text-slate-100"
                                            >
                                                {" "}
                                                Editar ruta
                                            </Button>
                                            <Button
                                                onClick={() => deletePizarra()}
                                                variant="shadow"
                                                className="lg:w-full  bg-red-700 text-slate-100"
                                            >
                                                Eliminar ruta
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                    <div className="flex flex-col gap-3 m-4">
                        <Card>
                            <CardHeader className="flex justify-center items-center mt-4">
                                <h1 className="text-xl font-bold">Fiscales</h1>
                            </CardHeader>
                            <CardBody>
                        <Table
                            defaultSelectedKeys={selectedKeys}
                            onSelectionChange={setSelectedKeys}
                            selectionMode="multiple"
                            aria-label="Example table with dynamic content"
                            >
                            <TableHeader>
                                {columns.map((column) => (
                                    <TableColumn key={column.key}>{column.label}</TableColumn>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {rows.map((row:any, index:any) => (
                                    <TableRow key={`${row._id}-${row.numero}`}>
                                        {(columnKey) => (
                                            <TableCell>{getKeyValue(row, columnKey)}</TableCell>
                                        )}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <div className="flex flex-col gap-4 m-3">
                            <Button
                                variant="shadow"
                                className="w-full bg-green-700 text-slate-100"
                                onClick={submitFiscales}
                            >
                                Agregar Fiscales asignados a la ruta
                            </Button>
                        </div>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}

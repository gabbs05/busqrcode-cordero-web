'use client'
import { Input, Divider, Button, Textarea, TimeInput, Checkbox, Card, CardBody, CardHeader, CardFooter, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue, Link, Select, SelectItem } from "@heroui/react";
import { Time } from "@internationalized/date";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface UnidadesProps {
    unidades?: any;
}

export default function Unidades_add({  unidades }: UnidadesProps) {
    const router = useRouter();

    const  submitForm = async (e: any) => {
        e.preventDefault();
        const form = new FormData(e.target);
        const data = {
            placa: form.get('placa'),
            numero: form.get('numero'),
            nombre_conductor: form.get('nombre'),
            telefono_conductor: form.get('telefono'),
        }
        try {
            const response = await axios.post('/api/unidades', data);
            if (response.status === 400) {
                throw new Error('Error al agregar unidad');
            } else if (response.status === 401) {
                console.log(response);
                toast.error('Ya existe una unidad con esa placa');
            } else if (response.status === 200) {
                toast.success('Unidad Agregada', {
                    onClose: () => router.push('/unidades')
                });
            }
        } catch (error: any) {
            console.log(error);
            if (error.response.status === 400) {
                toast.error('Error al agregar unidad');
            } else if (error.response.status === 401) {
                toast.error('Ya existe una unidad con esa placa');
            }
        }
    }

    return(
        <>
            <div className="mb-10 rounded-sm border border-stroke dark:bg-slate-800 bg-slate-200 shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="flex justify-center items-center ">
                    <Card className="my-5 lg:w-1/3">
                        <CardBody className="m-2">
                        <div className="m-5 ">
                            <h1 className="text-xl font-bold">Agregar Unidad</h1>
                            <Divider />
                            <div className="my-4 w-full">
                                <form onSubmit = {submitForm} className="grid gap-4 pr-3 w-full">
                                    <Input name="nombre" isRequired required type='text' label='Nombre del conductor' />
                                    <Input name="telefono" isRequired required type='number' label='Teléfono del conductor' />
                                    <Input name="placa" isRequired required type='text' label='Placa de la unidad' />
                                    <Input name="numero" isRequired required type='number' label='Número de la unidad' />
                                    <Button type="submit" variant="shadow" className="w-full bg-green-700 text-slate-100">Agregar Unidad</Button>
                                </form>
                            </div>
                        </div>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </>
    )
}
'use client'
import { Input, Divider, Button, Textarea, TimeInput, Checkbox, Card, CardBody, CardHeader, CardFooter, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue, Link } from "@heroui/react";
import { Time } from "@internationalized/date";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface fiscalesProps {
    fiscales?: any;
}
export default function Fiscales({ fiscales }: fiscalesProps) {
    const fiscal = JSON.parse(fiscales)

    return (
        <>
            <div className="mb-10 rounded-sm border border-stroke dark:bg-slate-800 bg-slate-200 shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="m-5">
                    <div className="grid grid-cols-3 my-4 gap-4">
                            {fiscal.map((unidad: any, index: any) => {

                            return (

                                <Card key={unidad._id} className="max-w-[300px]">
                                    <CardHeader className="flex gap-3">
                                        <div className="flex flex-col">
                                            <Link href={`/fiscales/${unidad._id}`} className="text-md"> Fiscal {unidad.numero}</Link>
                                        </div>
                                    </CardHeader>
                                    <Divider />
                                    <CardBody>
                                            <p><b>Uicación:</b> {unidad.ubicacion}</p>
                                    </CardBody>
                                    <Divider />
                                </Card>

                            )
                        })}
                    </div>
                    <div className="pt-4">
                        <Link href="/fiscales/add">
                            <Button variant='shadow' className={`bg-green-700 text-slate-100`}>Agregar Fiscal</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}
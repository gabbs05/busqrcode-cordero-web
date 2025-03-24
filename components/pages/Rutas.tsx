"use client";
import {
  Input,
  Divider,
  Button,
  Textarea,
  TimeInput,
  Checkbox,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  Link,
} from "@heroui/react";
import { Time } from "@internationalized/date";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface fiscalesProps {
  rutas?: any;
}
export default function Fiscales({ rutas }: fiscalesProps) {
  const ruta = JSON.parse(rutas);

  return (
    <>
      <div className="mb-10 rounded-sm border border-stroke dark:bg-slate-800 bg-slate-200 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="m-5">
          <div className="grid grid-cols-3 my-4 gap-4">
            {ruta.map((unidad: any, index: any) => {
              return (
                <Card key={unidad._id} className="max-w-[300px]">
                  <CardHeader className="flex gap-3">
                    <div className="flex flex-col">
                      <Link href={`/rutas/${unidad._id}`} className="text-md">
                        {" "}
                        <b>Ruta </b> {`: ${unidad.nombre}`}
                      </Link>
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
          <div className="pt-4">
            <Link href="/rutas/add">
              <Button
                variant="shadow"
                className={`bg-green-700 text-slate-100`}
              >
                Agregar Ruta
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

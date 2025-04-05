import { connectDB } from "@/libs/db";
import timestamps from "@/models/timestamps";
import fiscales from "@/models/fiscales";
import rutas from "@/models/rutas";
import { NextResponse } from "next/server";

connectDB();

export async function POST(request: any) {
  const { id_ruta, id_unidad, id_fiscal, timestamp_telefono, timestamp_salida } = await request.json();
  console.log(id_ruta, id_unidad, id_fiscal, timestamp_telefono, timestamp_salida);


  const formatHour = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const secs = String(date.getSeconds()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const strHours = String(hours).padStart(2, "0");
    return `${strHours}:${minutes} ${ampm}`;
  };
  const formatHour30secs = (dateString: string) => {
    const date = new Date(dateString);
    date.setSeconds(date.getSeconds() - 30); // Adelantar 30 segundos jasjsjjadas
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const secs = String(date.getSeconds()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const strHours = String(hours).padStart(2, "0");
    return `${strHours}:${minutes} ${ampm}`;
  };

  const convertToMinutes = (timeString: string): number => {
    const [time, modifier] = timeString.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (modifier === "PM" && hours !== 12) {
      hours += 12;
    }
    if (modifier === "AM" && hours === 12) {
      hours = 0;
    }
    return hours * 60 + minutes;
  };


  const compareTimestamps = (
    time1: string,
    time2: string,
    maxDelay: number
  ) => {
    const minutes1 = convertToMinutes(time1);
    const minutes2 = convertToMinutes(time2);
    console.log(time1, time2, maxDelay)
    // Calcular la diferencia en minutos
    const diff = minutes2 - minutes1;
    return {
      onTime: diff <= maxDelay,
      onTimeText: diff <= maxDelay ? "A tiempo" : "Retardado",
      diff,
      delay: diff > maxDelay ? diff - maxDelay : 0,
    };
  };


  try {
    // Obtener la fecha de hoy
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // Buscar registros de timestamps donde coincidan id_unidad, id_ruta y createdAt sea del día de hoy
    const unidTimestamps = await timestamps.find({
      id_unidad,
      createdAt: {
        $gte: today,
        $lt: tomorrow,
      },
    });
    unidTimestamps.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    console.log(unidTimestamps[0], "Unidad anterior de la misma ruta");

    //buscar todas las rutas y filtrar la ruta actual
    const findRutas = await rutas.find();
    const findRuta = findRutas.find((ruta) => ruta._id == id_ruta);

    // Buscar el fiscal con ubicación 'Terminal' o 'Barrancas'
    const findFiscales = await fiscales.find();
    const terminalFiscal = findFiscales.find((fiscal) => fiscal.ubicacion === "Terminal");
    const R1R2Fiscal = findFiscales.find((fiscal) => fiscal.ubicacion === "R1R2");
    const centralFiscal = findFiscales.find((fiscal) => fiscal.ubicacion === "Central Cordero");

    // Filtrar el registro anterior más cercano en el lapso de 60 minutos
     const closestTimestamp = unidTimestamps.find((timestamp) => {
       const terminalFiscalId = terminalFiscal?._id;
       const R1R2FiscalId = R1R2Fiscal?._id;
       const centralFiscalId = centralFiscal?._id;

       // Buscar fiscales con setHora === true
       const setHoraFiscales = findFiscales
         .filter((fiscal) => fiscal.sethora === true)
         .map((fiscal) => fiscal._id);

       // Verificar si el timestamp.id_fiscal coincide con el fiscal del terminal, barrancas o alguno con setHora === true
       const isValidFiscal =
         timestamp.id_fiscal.toString() === terminalFiscalId?.toString() ||
         timestamp.id_fiscal.toString() === R1R2FiscalId?.toString() ||
          timestamp.id_fiscal.toString() === centralFiscalId?.toString() ||
         setHoraFiscales.some(
           (fiscalId) => timestamp.id_fiscal.toString() === fiscalId?.toString()
         );

       if (isValidFiscal) {
         const timeDiff = Math.abs(
           new Date().getTime() - new Date(timestamp.createdAt).getTime()
         );
         const diffInMinutes = timeDiff / (1000 * 100); // Convertir diferencia a minutos
         return diffInMinutes <= 100;
       }
       return false;
     });

    // Si no se encuentra un registro válido, devolver null
    const findFiscal = await fiscales.findOne({ _id: id_fiscal });


    if (findFiscal.sethora) {
      const timestamp = new timestamps({
        id_ruta,
        id_unidad,
        id_fiscal,
        timestamp_telefono,
        timestamp_salida
      });;
      const saveTimestamp = await timestamp.save();
      return NextResponse.json(saveTimestamp);
    } else {
      if (closestTimestamp) {
      console.log(closestTimestamp, "Timestamp más cercano encontrado");
         const timestamp = new timestamps({
           id_ruta: closestTimestamp.id_ruta,
           id_unidad,
           id_fiscal,
           timestamp_telefono,
           timestamp_salida: null,
         });


      const findFiscal2 = await fiscales.findOne({
        _id: closestTimestamp.id_fiscal,
      });
      

      //subiendo

      let tiempo = 0;
      if (
        findFiscal.ubicacion == "Confitería el Loro" &&
        findFiscal2.ubicacion == "Terminal"
      ) {
        tiempo = 15;
      } else if (
        findFiscal.ubicacion == "Dorsay" &&
        findFiscal2.ubicacion == "Terminal"
      ) {
        tiempo = 23;
      } else if (
        findFiscal.ubicacion == "Biblioteca" &&
        findFiscal2.ubicacion == "Terminal"
      ) {
        tiempo = 28;
      } else if (
        findFiscal.ubicacion == "Plazuela de Táriba" &&
        findFiscal2.ubicacion == "Terminal"
      ) {
        tiempo = 40;
      } else if (
        findFiscal.ubicacion == "Central Cordero" &&
        findFiscal2.ubicacion == "Terminal"
      ) {
        tiempo = findRuta?.nombre === "4/2" ? 77 : 72;
      } else if (
        //tiempos bajando
        findFiscal.ubicacion == "Central Cordero" &&
        findFiscal2.ubicacion == "R1R2"
      ) {
        tiempo = 10;
      } else if (
        findFiscal.ubicacion == "Plaza Andrés Bello" &&
        findFiscal2.ubicacion == "R1R2"
      ) {
        tiempo = 18;
      } else if (
        findFiscal.ubicacion == "Plazuela de Táriba" &&
        findFiscal2.ubicacion == "R1R2"
      ) {
        tiempo = 30;
      } else if (
        findFiscal.ubicacion == "Plaza Andrés Bello" &&
        findFiscal2.ubicacion == "Central Codero"
      ) {
        tiempo = 48;
      } else if (
        findFiscal.ubicacion == "Bomba San Rafael" &&
        findFiscal2.ubicacion == "Central Codero"
      ) {
        if (findRuta?.nombre === "R6") {
          tiempo = 19;
        } else if (findRuta?.nombre === "R7") {
          tiempo = 27;
        } else if (findRuta?.nombre === "R8") {
          tiempo = 58;
        }
      } else if (
        findFiscal.ubicacion == "Plazuela de Táriba" &&
        findFiscal2.ubicacion == "Central Codero"
      ) {
        if (findRuta?.nombre === "R6") {
          tiempo = 31;
        } else if (findRuta?.nombre === "R7") {
          tiempo = 39;
        } else if (findRuta?.nombre === "R8") {
          tiempo = 70;
        }
      } else if (
        findFiscal.ubicacion == "Terminal" &&
        findFiscal2.ubicacion == "Central Codero"
      ) {
        if (findRuta?.nombre === "R6") {
          tiempo = 70;
        } else if (findRuta?.nombre === "R7") {
          tiempo = 60;
        } else if (findRuta?.nombre === "R8") {
          tiempo = 90;
        }
      }
      

      const time1 = formatHour(closestTimestamp.timestamp_salida)
      const time2 = formatHour30secs(timestamp_telefono)
        const comparison = compareTimestamps(
          time1,
          time2,
          tiempo
        );
        console.log("Comparison Result:", comparison);

        if (comparison.onTime) {
          console.log("A tiempo:", comparison.onTimeText);
          const saveTimestamp = await timestamp.save();
          console.log("saveTimestamp:", saveTimestamp);
          return NextResponse.json({ message: "A tiempo" }, { status: 200 });
        } else if (comparison.delay > 0) {
          console.log("Retardado:", comparison.delay);
          const saveTimestamp = await timestamp.save();
          console.log("saveTimestamp:", saveTimestamp);
          return NextResponse.json({ message: "Retardado", delay: comparison.delay}, { status: 201 });
        }
    }else{
      console.log('no se encontró timestamp cercano')
    }
      return NextResponse.json({ message: "No se encontró timestamp cercano" }, { status: 202 });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json((error as Error).message, { status: 400 });
  }
}

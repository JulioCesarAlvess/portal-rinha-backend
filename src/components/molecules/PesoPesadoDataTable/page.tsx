"use client"
import Label from "@components/atoms/Label/page";
import PesoPesadoIcon from "@components/atoms/PesoPesadoIcon/page";
import DataTable from "@components/molecules/DataTable/page";
import { useRankingContext } from "@contexts/RankingContext";
import { baseUrl } from "@server/api";
import { useEffect, useState } from "react";
import { ColumnType } from "../DataTable/types";
import PesoPesadoPagination from "../PesoPesadoPagination/page";

const PesoPesadoDataTable = () => {
  const columns: ColumnType[] = [
    { title: 'Nota', alignment: 'center', width: '20%' },
    { title: 'Email', alignment: 'left', width: '30%' },
    { title: 'Data Envio', alignment: 'left', width: '20%' },
    { title: 'Linguagem', alignment: 'center', width: '10%' },
    { title: 'Categoria', alignment: 'center', width: '20%' },
  ];
  const { pesoPesadoPage } = useRankingContext();
  const [data, setData] = useState(undefined);

  useEffect(() => {
    fetch('/api/auth/session')
      .then((response) => response.json())
      .then((response) => {
        fetch(`${baseUrl}/ranking?categoria=PESO_PESADO&size=4&page=${pesoPesadoPage}`, {
          headers: {
            Authorizarion: `Bearer ${response.access_token}`
          }
        })
          .then(response => response.json())
          .then((result) => {
            const pesoPesadoData = result?.content.map((pesoPesado: any, index: any) => {
              const rank = {
                email: pesoPesado.userId,
                nota: Number(pesoPesado.nota).toFixed(2),
                dataEnvio: pesoPesado.dataEnvio,
                linguagem: pesoPesado.linguagem,
                categoria: <PesoPesadoIcon />
              }
              return rank;
            })
            setData(pesoPesadoData);
          })
      })

  }, [])

  if (!data) return <Label value="Carregando..." />

  return <div className="bg-[#3D3D3D80] rounded-xl">
    <DataTable columns={columns} rows={data} />
    <PesoPesadoPagination />
  </div>;
};

export default PesoPesadoDataTable;

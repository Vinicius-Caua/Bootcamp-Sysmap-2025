import ActivitiesBottonListPage from "@/components/HomeComponents/activitiesBottonListPage";
import ActivitiesGrid from "@/components/ActivitiesComponents/activitiesGrid";
import ActivitiesTypes from "@/components/ActivitiesComponents/activitiesTypes";
import { useParams } from "react-router";

function ListagemTipo() {
  const { typeId, typeName } = useParams<{
    typeId: string;
    typeName: string;
  }>(); // Get typeId and typeName from route params

  return (
    <>
      <ActivitiesGrid
        title={`Popular em ${typeName}`} // Custom title
        typeId={typeId} // Filter by typeId
      />
      <ActivitiesBottonListPage/>
      {/* Section for activities by type */}
      <ActivitiesTypes title={"Outros tipos de atividade"} />
      {/* Section for activity types */}
    </>
  );
}

export default ListagemTipo;

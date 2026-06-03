import { HorarioForm } from "../../components";
import { FormPage } from "../../components/PageContainer";

const AgregarHorario = () => {
  return (
    <FormPage title="Nuevo horario" subtitle="Bloques horarios por empresa.">
      <HorarioForm />
    </FormPage>
  );
};

export default AgregarHorario;

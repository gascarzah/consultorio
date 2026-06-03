import { ProgramacionForm } from "../../components";
import { FormPage } from "../../components/PageContainer";

const AgregarProgramacion = () => {
  return (
    <FormPage title="Nueva programación" subtitle="Define el rango de fechas de atención." maxWidth="max-w-4xl">
      <ProgramacionForm />
    </FormPage>
  );
};

export default AgregarProgramacion;

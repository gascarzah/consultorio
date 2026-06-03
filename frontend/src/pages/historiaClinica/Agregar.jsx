import { HistoriaClinicaForm } from "../../components";
import { FormPage } from "../../components/PageContainer";

const AgregarHistoriaClinica = () => {
  return (
    <FormPage title="Nueva historia clínica" subtitle="Registro del paciente en la empresa." maxWidth="max-w-4xl">
      <HistoriaClinicaForm />
    </FormPage>
  );
};

export default AgregarHistoriaClinica;

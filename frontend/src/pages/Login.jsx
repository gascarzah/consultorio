import { ErrorMessage, Field, Form, Formik } from "formik";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";

import { loadAuthProfile, login } from "../slices/authSlice";
import { VALIDATION_MESSAGES } from "../utils/ValidationMessages";

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email(VALIDATION_MESSAGES.FORMAT.EMAIL_INVALID)
    .required(VALIDATION_MESSAGES.REQUIRED.EMAIL),
  password: Yup.string().required(VALIDATION_MESSAGES.REQUIRED.PASSWORD),
});

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = (values) => {
    const { password } = values;

    if (password.length < 6) {
      toast.error(VALIDATION_MESSAGES.ERROR.PASSWORD_CORTO);
      return;
    }

    dispatch(login(values))
      .unwrap()
      .then(() => dispatch(loadAuthProfile(values.email)).unwrap())
      .then(() => {
        navigate("/dashboard");
      })
      .catch(() => {
        toast.error(VALIDATION_MESSAGES.ERROR.USUARIO_NO_EXISTE);
      });
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
          Iniciar sesión
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Accede al panel del consultorio médico
        </p>
      </div>

      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        onSubmit={(values) => {
          handleSubmit(values);
        }}
        validationSchema={loginSchema}
      >
        {() => (
          <Form className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="space-y-5">
              <div>
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <Field
                  id="email"
                  type="email"
                  placeholder="tu@correo.com"
                  className="form-input mt-1 block w-full rounded-lg border-gray-300 px-3 py-2.5"
                  name="email"
                />
                <ErrorMessage
                  name="email"
                  component="p"
                  className="error-message"
                />
              </div>
              <div>
                <label htmlFor="password" className="form-label">
                  Contraseña
                </label>
                <Field
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="form-input mt-1 block w-full rounded-lg border-gray-300 px-3 py-2.5"
                  name="password"
                />
                <ErrorMessage
                  name="password"
                  component="p"
                  className="error-message"
                />
              </div>
              <button type="submit" className="btn-primary w-full justify-center py-2.5">
                Iniciar sesión
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Login;

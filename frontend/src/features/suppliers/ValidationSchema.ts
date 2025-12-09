/* eslint-disable @typescript-eslint/no-unused-vars */
import * as Yup from "yup";
import { useTranslation } from "react-i18next";

export default function ValidationSchema() {
      const { t } = useTranslation();
    
     const validationSchema = Yup.object({
        name: Yup.string().min(3 , "name main 3 letters").required(t("required")),
        company: Yup.string().min(3 , "name main 3 letters").required(t("required")),
        email: Yup.string().email("email is in-valid").required(t("required")),
        contactNumber: Yup.string()
          .matches(/^05\d{8}$/, t("invalidPhone"))
          .required(t("required")),
        // updatedAt: Yup.date().required(t("required")),
      });
  
}

import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import DefaultInputs from "../../components/form/form-elements/DefaultInputsUser";
import PageMeta from "../../components/common/PageMeta";

export default function FormProdukUser() {
  return (
    <div>
      <PageMeta
        title="React.js Form Elements Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Form Elements  Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Form Elements" />
        <div className="space-y-6">
          <DefaultInputs />
        </div>
        <div className="space-y-6">
        </div>
      </div>
  );
}

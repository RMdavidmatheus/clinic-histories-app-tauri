import PatientsTable from "./data-table-patients";

export default function PatientsComponent() {
    return (
        <section className="flex flex-col p-5 h-full">
            <PatientsTable />
        </section>
    )
}
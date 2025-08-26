import PatientsTable from "./data-table-patients";

export default function PatientsComponent() {
    return (
        <section className="flex flex-col p-3 h-full">
            <PatientsTable />
        </section>
    )
}
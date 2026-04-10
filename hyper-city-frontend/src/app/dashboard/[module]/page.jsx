import DashboardPage from '../page'

export default async function DashboardModulePage({ params }) {
  const resolvedParams = await params
  return <DashboardPage selectedModuleId={resolvedParams.module} />
}

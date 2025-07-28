import { getDogs, getRecentActivity, getTutors } from "@/lib/data";
import RecentActivityList from "@/components/dashboard/recent-activity-list";
import PregnantDogsList from "@/components/dashboard/pregnant-dogs-list";

export default async function DashboardPage() {
    const dogs = await getDogs();
    const tutors = await getTutors();
    const recentActivity = await getRecentActivity();

    const availableDogs = dogs.filter((dog) => dog.status === 'Disponível').length;
    const totalTutors = tutors.length;
    const pregnantDogs = dogs.filter(dog => dog.status === 'Gestante');

    return (
        <>
            <div className="page-header">
                <h2>Dashboard</h2>
                <p>Visão geral completa da sua operação de canil</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-title">Cães Disponíveis</div>
                        <div className="stat-icon dogs">
                            <i className="fas fa-dog"></i>
                        </div>
                    </div>
                    <div className="stat-value">{availableDogs}</div>
                    <div className="stat-subtitle">Total de cães à venda</div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-title">Tutores Cadastrados</div>
                        <div className="stat-icon tutors">
                            <i className="fas fa-users"></i>
                        </div>
                    </div>
                    <div className="stat-value">{totalTutors}</div>
                    <div className="stat-subtitle">Total de clientes no sistema</div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-title">Gestações Pendentes</div>
                        <div className="stat-icon pending">
                            <i className="fas fa-clock"></i>
                        </div>
                    </div>
                    <div className="stat-value">{pregnantDogs.length}</div>
                    <div className="stat-subtitle">Total de cadelas prenhas</div>
                </div>
            </div>
            
            <div className="activity-section">
                <div className="card activity-card">
                    <h3 className="section-title">
                        <i className="fas fa-history"></i>
                        Atividade Recente
                    </h3>
                    <RecentActivityList items={recentActivity} />
                </div>
                 <div className="card tracking-card">
                    <h3 className="section-title">
                        <i className="fas fa-chart-line"></i>
                        Acompanhamento de Gestações
                    </h3>
                    <PregnantDogsList dogs={pregnantDogs} />
                </div>
            </div>

        </>
    );
}

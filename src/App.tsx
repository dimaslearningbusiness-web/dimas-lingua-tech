import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase'; // Garante que este caminho está correto
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDashboard() {
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarAlunos() {
      try {
        setLoading(true);
        // Busca os dados na tabela 'alunos' do Supabase
        const { data, error } = await supabase
          .from('alunos')
          .select('*')
          .order('id', { ascending: false });

        if (error) throw error;
        if (data) setAlunos(data);
      } catch (error) {
        console.error('Erro ao carregar alunos:', error.message);
      } finally {
        setLoading(false);
      }
    }
    carregarAlunos();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-blue-900">Painel de Gestão</h1>
            <p className="text-slate-500">DImaslearning - Base de Dados de Alunos</p>
          </div>
          <Button onClick={() => window.location.reload()} variant="outline">
            Atualizar Dados
          </Button>
        </div>

        <Card className="border-none shadow-lg">
          <CardHeader className="bg-blue-600 rounded-t-lg">
            <CardTitle className="text-white">Lista de Inscritos</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b text-slate-700 uppercase text-xs font-semibold">
                    <th className="p-4 text-center">Data</th>
                    <th className="p-4">Nome do Aluno</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Telefone</th>
                    <th className="p-4">Curso</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-500">A carregar dados dos alunos...</td>
                    </tr>
                  ) : alunos.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-500">Nenhum aluno encontrado.</td>
                    </tr>
                  ) : (
                    alunos.map((aluno: any) => (
                      <tr key={aluno.id} className="hover:bg-blue-50 transition-colors">
                        <td className="p-4 text-center text-slate-500 text-sm">
                          {aluno.data_inscricao ? new Date(aluno.data_inscricao).toLocaleDateString() : '-'}
                        </td>
                        <td className="p-4 font-medium text-slate-800">
                          {aluno["Nome do Aluno"] || aluno.nome}
                        </td>
                        <td className="p-4 text-blue-600 underline text-sm">
                          {aluno.Email || aluno.email}
                        </td>
                        <td className="p-4 text-slate-600 text-sm">
                          {aluno.Telefone || aluno.telefone}
                        </td>
                        <td className="p-4">
                          <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                            {aluno["Curso de Interesse"] || aluno.curso_interesse || 'Geral'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

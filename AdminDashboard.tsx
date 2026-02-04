import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';

export default function AdminDashboard() {
  const [alunos, setAlunos] = useState([]);

  // Função para carregar os alunos do Supabase
  useEffect(() => {
    async function carregarAlunos() {
      const { data, error } = await supabase
        .from('alunos')
        .select('*')
        .order('data_inscricao', { ascending: false });
      
      if (data) setAlunos(data);
    }
    carregarAlunos();
  }, []);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-900 mb-8 border-b-2 border-blue-600 pb-2">
          Painel de Gestão - DImaslearning
        </h1>
        
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-4">Nome</th>
                <th className="p-4">Email</th>
                <th className="p-4">Telefone</th>
                <th className="p-4">Curso</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {alunos.map((aluno: any) => (
                <tr key={aluno.id} className="hover:bg-blue-50 transition">
                  <td className="p-4 font-medium">{aluno.nome}</td>
                  <td className="p-4 text-gray-600">{aluno.email}</td>
                  <td className="p-4 text-gray-600">{aluno.telefone}</td>
                  <td className="p-4">
                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm">
                      {aluno.curso_interesse}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

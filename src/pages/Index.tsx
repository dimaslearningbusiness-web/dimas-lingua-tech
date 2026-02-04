import { useState } from "react";
import { supabase } from "../lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

export default function Index() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const dados = {
      "Nome do Aluno": formData.get("nome"),
      Email: formData.get("email"),
      Telefone: formData.get("telefone"),
      "Curso de Interesse": formData.get("curso"),
      data_inscricao: new Date().toISOString(),
    };

    const { error } = await supabase.from("alunos").insert([dados]);

    if (error) {
      toast({
        variant: "destructive",
        title: "Erro na inscrição",
        description: error.message,
      });
    } else {
      toast({
        title: "Sucesso!",
        description: "A tua inscrição foi recebida pela DImaslearning.",
      });
      (e.target as HTMLFormElement).reset();
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Header / Hero */}
      <header className="bg-gradient-to-r from-blue-900 to-blue-700 py-20 px-4 text-center text-white">
        <h1 className="text-5xl font-extrabold mb-4 tracking-tight">DImaslearning</h1>
        <p className="text-xl text-blue-100 max-w-2xl mx-auto">
          Plataforma de E-learning moderna. Aprende gestão e tecnologia com conteúdos exclusivos.
        </p>
      </header>

      <main className="max-w-4xl mx-auto -mt-10 p-6">
        <div className="grid md:grid-cols-2 gap-12 bg-white shadow-2xl rounded-2xl p-8 border border-slate-100">
          
          {/* Coluna 1: Info */}
          <div>
            <h2 className="text-2xl font-bold text-blue-900 mb-6">Porquê estudar connosco?</h2>
            <ul className="space-y-4 text-slate-600">
              <li className="flex items-center">✅ Materiais em PPTX e DOCX</li>
              <li className="flex items-center">✅ Acesso a Dashboard de Aluno</li>
              <li className="flex items-center">✅ Suporte direto via plataforma</li>
            </ul>
          </div>

          {/* Coluna 2: Formulário */}
          <div className="bg-slate-50 p-6 rounded-xl border border-blue-100">
            <h3 className="text-lg font-semibold mb-4 text-blue-800">Inscrição Rápida</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input name="nome" placeholder="Teu nome completo" required className="bg-white" />
              <Input name="email" type="email" placeholder="Email principal" required className="bg-white" />
              <Input name="telefone" placeholder="Telemóvel" className="bg-white" />
              <select 
                name="curso" 
                className="w-full h-10 px-3 rounded-md border border-input bg-white text-sm focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Seleciona um curso</option>
                <option value="Gestão de Projetos">Gestão de Projetos</option>
                <option value="Tecnologia Aplicada">Tecnologia Aplicada</option>
                <option value="Excel Avançado">Excel Avançado</option>
              </select>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg" disabled={loading}>
                {loading ? "A processar..." : "Quero inscrever-me"}
              </Button>
            </form>
          </div>
        </div>
      </main>

      <footer className="py-12 text-center text-slate-400 text-sm">
        © 2024 DImaslearning - Todos os direitos reservados.
      </footer>
    </div>
  );
}


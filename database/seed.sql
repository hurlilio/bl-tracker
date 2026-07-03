-- Dados Iniciais

-- Usuário admin (senha: admin123)
INSERT INTO usuarios (nome, email, senha) 
VALUES ('Admin', 'admin@bltracker.com', '$2a$10$6WX8f5QZ7y8s5X7Z8Y9w6O6a7b8c9d0e1f2g3h4i5j6k7l8m9n0')
ON CONFLICT (email) DO NOTHING;

-- Séries
INSERT INTO series (titulo, sinopse, pais, ano, temporadas, genero) VALUES 
('Semantic Error', 'Um estudante de design e um de ciência da computação se encontram em um projeto de grupo.', 'Coreia do Sul', 2022, 1, 'Romance, Comédia'),
('KinnPorsche', 'A história de Kinn e Porsche em um mundo de máfia.', 'Tailândia', 2022, 1, 'Ação, Romance'),
('Cherry Magic', 'Um funcionário de escritório ganha o poder de ler mentes.', 'Japão', 2020, 1, 'Romance, Comédia'),
('Bad Buddy', 'Dois estudantes de faculdade rivais começam um relacionamento secreto.', 'Tailândia', 2021, 1, 'Romance, Comédia'),
('Cutie Pie', 'Uma história sobre um noivado arranjado entre dois homens.', 'Tailândia', 2022, 1, 'Romance'),
('Blueming', 'Dois estudantes de cinema com personalidades opostas se aproximam.', 'Coreia do Sul', 2022, 1, 'Romance, Drama'),
('My School President', 'Um estudante do ensino médio tenta conquistar o coração do presidente do clube de música.', 'Tailândia', 2022, 1, 'Romance, Comédia'),
('The Eclipse', 'Em um colégio com regras rígidas, um aluno desafiador atrai a atenção do monitor.', 'Tailândia', 2022, 1, 'Romance, Drama'),
('A Tale of Thousand Stars', 'Um voluntário urbano viaja para uma vila remota e encontra um novo propósito.', 'Tailândia', 2021, 1, 'Romance, Drama'),
('To My Star', 'Um famoso ator e um chef de cozinha se encontram após um escândalo.', 'Coreia do Sul', 2021, 1, 'Romance'),
('We Best Love', 'Uma série sobre amor, rivalidade e música.', 'Taiwan', 2021, 2, 'Romance, Drama'),
('I Told Sunset About You', 'Dois amigos de infância se reencontram e redescobrem seus sentimentos.', 'Tailândia', 2020, 1, 'Romance, Drama')
ON CONFLICT (id) DO NOTHING;
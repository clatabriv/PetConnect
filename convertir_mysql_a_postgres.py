#!/usr/bin/env python3
import re
import sys

def convert_mysql_to_postgres(input_file, output_file):
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Eliminar comandos específicos de MySQL
    content = re.sub(r'/\*!.*?\*/;', '', content, flags=re.DOTALL)
    content = re.sub(r'SET .*?;', '', content)
    content = re.sub(r'DROP TABLE.*?;', '', content, flags=re.IGNORECASE)
    content = re.sub(r'CREATE TABLE.*?;', '', content, flags=re.DOTALL | re.IGNORECASE)
    content = re.sub(r'LOCK TABLES.*?;', '', content, flags=re.IGNORECASE)
    content = re.sub(r'UNLOCK TABLES;', '', content, flags=re.IGNORECASE)
    
    # Cambiar comillas invertidas por comillas dobles
    content = content.replace('`', '"')
    
    # Cambiar ENGINE, CHARSET, etc
    content = re.sub(r'\s*ENGINE=\w+', '', content)
    content = re.sub(r'\s*DEFAULT CHARSET=\w+', '', content)
    content = re.sub(r'\s*AUTO_INCREMENT=\d+', '', content)
    
    # Limpiar líneas vacías múltiples
    content = re.sub(r'\n\s*\n', '\n\n', content)
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"Conversión completada: {output_file}")

if __name__ == "__main__":
    convert_mysql_to_postgres("datos_backup.sql", "datos_postgres.sql")

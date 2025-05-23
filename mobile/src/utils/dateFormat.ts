export function formatDate(dateString: string): string {
  if (!dateString) {
    return '';
  }

  try {
    const date = new Date(dateString);

    // Date
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    // Time
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  } catch (error) {
    console.error('Erro ao formatar data:', error);
    return 'Data inválida';
  }
}

// Format string date for: dd/mm/aaaa
export function formatDateOnly(dateString: string): string {
  if (!dateString) {
    return '';
  }

  try {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  } catch (error) {
    return 'Data inválida';
  }
}

// Format string time for: hh:mm
export function formatTimeOnly(dateString: string): string {
  if (!dateString) {
    return '';
  }

  try {
    const date = new Date(dateString);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${hours}:${minutes}`;
  } catch (error) {
    return 'Horário inválido';
  }
}

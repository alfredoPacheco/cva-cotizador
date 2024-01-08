import { useDollar } from './dollar.hooks';

const SyscomDollarReadonly = () => {
  const { data, isLoading } = useDollar();
  return (
    <div className="flex flex-row gap-2">
      <label>Syscom Dollar:</label>
      <span>{isLoading ? '...cargando' : data?.dollar}</span>
    </div>
  );
};

export default SyscomDollarReadonly;

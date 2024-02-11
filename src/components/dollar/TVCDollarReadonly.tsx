import { useDollar } from './dollar.hooks';

const TVCDollarReadonly = () => {
  const { data, isLoading } = useDollar();
  return (
    <div className="flex flex-row gap-2">
      <label>TVC:</label>
      <span>{isLoading ? '...cargando' : data?.dollar}</span>
    </div>
  );
};

export default TVCDollarReadonly;

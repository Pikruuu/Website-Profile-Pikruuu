interface KapsulProps {
    deskripsi: string;
}

export default function Kapsul({deskripsi}:KapsulProps) {
    return (
        <div className='h-fit w-fit border-2 rounded-full border-hitam shadow shadow-hitam/70 p-2'>
            <p className='font-["Komika"] text-xl'>{deskripsi}</p>
        </div>
    )
}

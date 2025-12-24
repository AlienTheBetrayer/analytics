type Props = {
    currentId: string;
}

export const Emulate = ({currentId }: Props) => {
    return (
        <div className='box w-full max-w-64 m-auto'>
            {currentId}
        </div>
    )
}